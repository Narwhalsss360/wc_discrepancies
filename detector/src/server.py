from typing import Callable
from threading import Thread
from datetime import datetime
from traceback import print_stack, format_stack
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
from config import Config
from discrepancy_logging import Log
from datatypes import Discrepancy, Student
from detection import detect_all_sync, ProgressReport


app = Flask(__name__)
cors = CORS(app)
cfg: Config = None


@app.route('/', methods=['GET'])
def status_endpoint():
    return jsonify(cfg.pgm_state), 200


@app.route('/logs', methods=['GET'])
def logs_endpoint():
    return jsonify(list(Log.logs())), 200


@app.route('/discrepancies', methods=['GET'])
def discrepancies_endpoint():
    return jsonify(list(filter(lambda discrepancy: discrepancy.resolved_by is None, cfg.discrepancies))), 200


@app.route('/resolved_discrepancies', methods=['GET'])
def resolved_discrepancies_endpoint():
    return jsonify(list(filter(lambda discrepancy: discrepancy.resolved_by is not None, cfg.discrepancies))), 200


@app.route('/detect', methods=['POST'])
def detect_endpoint():
    remote: str = request.remote_addr
    def detect_thread():
        wc_students: list[Student] = cfg.wc_students
        discrepancies: list[Discrepancy] = cfg.discrepancies
        last: int = len(wc_students) - 1
        def progress_reported(progress: ProgressReport):
            if progress.completed_student:
                cfg.pgm_state['detect_progress_percent'] = None if progress.index == last else progress.index / last * 100

        Log.out(Log(5, 'server:detect_endpoint:detect_thread', f'Detection started by {remote}.'))
        new_discrepancies: list[Discrepancy] = detect_all_sync(wc_students, cfg.database_students, discrepancies, progress_reported)
        Log.out(Log(1, 'server:detect_endpoint:detect_thread', f'Detection finished. {len(new_discrepancies)} new discrepancies.'))
        discrepancies.extend(new_discrepancies)
        cfg.commit_discrepancies(discrepancies)
        cfg.pgm_state['last_detect'] = datetime.now().isoformat()


    if cfg.pgm_state['detect_progress_percent'] is not None:
        return jsonify({
            'error': 'Currently detecting'
        }), 400

    thread = Thread(target=detect_thread, name='server:detect')
    thread.start()
    return Response(status=200)


@app.route('/resolve', methods=['PUT'])
def resolve_endpoint():
    if not request.is_json:
        return jsonify({
            'error': f'Must put a Discrepancy as json in body'
        }), 400

    try:
        resolved_discrepancy: Discrepancy = Discrepancy(**request.json)
    except Exception:
        return jsonify({
            'error': f'Must put a Discrepancy as json in body'
        }), 400

    discrepancies: list[Discrepancy] = cfg.discrepancies
    for discrepancy in discrepancies:
        compare: Callable = lambda: discrepancy.discovered == resolved_discrepancy.discovered and \
                        discrepancy.wc_info == discrepancy.wc_info
        if compare():
            discrepancy.resolve(resolved_discrepancy.resolve_message, resolved_discrepancy.resolved_by)
            cfg.commit_discrepancies(discrepancies)
            return jsonify(dict(discrepancy)), 200

    return jsonify({
        'error': f'Discrepancy not found',
        'discrepancy': request.json
    }), 400


@app.route('/report-bug', methods=['PUT'])
def report_bug_endpoint():
    if not request.is_json:
        return jsonify({
            'error': f'Bug report must be json in body'
        }), 400

    if 'message' not in request.json:
        return jsonify({
            'error': f'Bug report object must contain message'
        }), 400

    report = dict(request.json)
    report['at'] = datetime.now().isoformat()
    report['remote'] = request.remote_addr
    report['addressed'] = False
    if 'bug_report' not in cfg.pgm_state:
        cfg.pgm_state['bug_reports'] = []

    cfg.pgm_state['bug_reports'].append(report)
    cfg.save()
    Log.out(Log(10, 'server:report_bug_endpoint', f'Bug reported: {report}'))
    return Response(status=200)

@app.errorhandler(Exception)
def on_error(exc: Exception):
    if isinstance(exc, HTTPException):
        return jsonify({
            'error': exc.name,
            'code': exc.code,
            'description': exc.description
        }), exc.code

    Log.out(Log(10, 'server:on_error', f'Fatal exception: {exc}'))
    print_stack()

    return jsonify({
        'fatal': repr(exc),
        'stack': format_stack()
    }), 500


def main(use_cfg: Config):
    global cfg
    if not use_cfg.valid:
        raise RuntimeError('Configuration invalid')
    cfg = use_cfg

    if 'last_detect' not in cfg.pgm_state:
        cfg.pgm_state['last_detect'] = None
    if 'detect_progress_percent' not in cfg.pgm_state:
        cfg.pgm_state['detect_progress_percent'] = None

    Log.out(Log(0, 'server:main', 'Server started'))
    app.run('0.0.0.0', port=2155, use_reloader=False)
    Log.out(Log(0, 'server:main', 'Server stopped'))
    cfg.save()


if __name__ == '__main__':
    main(Config.load_valid())
