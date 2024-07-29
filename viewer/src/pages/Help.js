import React from 'react'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import SmallPage from '../components/SmallPage'

export default function Help() {
  return (
    <SmallPage>
      <h1>Help</h1>
      <ul>
        <li>
          <label>Click <strong>Discrepancies Viewer</strong> in the navbar to go back to the homepage.</label>
        </li>
        <li>
          <label>The badges on the navbar will show the status of the detector server:</label>
        </li>
        <ul>
          <li>
            <label>When connection to the server is successful, the badge </label>&nbsp;
            <Badge>Server OK</Badge>&nbsp;
            <label> will appear.</label>
          </li>
          <li>
            <label>When unsuccessful the badge </label>&nbsp;
            <Badge bg='danger'>Server state unkown</Badge>&nbsp;
            <label> Will appear. No data can be retrieved in this state.</label>
          </li>
          <li><em>Click these badges to refresh the server state.</em></li>
        </ul>
        <li>
          <label>The navbar will also show the date of last detection, if the last date of detection is unkown, the badge </label>&nbsp;
          <Badge bg='danger'>Has not detected/Unkown date</Badge>&nbsp;
          <label> will appear. This means the data shown <em>may</em> not be reliable.</label>
        </li>
        <li>
          <label><strong>Logs:</strong> Logs are the logs from the server to keep track of important events in history.</label>
        </li>
        <li>
          <label>Click the </label>&nbsp;
          <Button variant='outline-warning'>Detect</Button>&nbsp;
          <label> button to detect discrepancies now. <em>Effectively checks only new registrations from the time of last detection to now.</em></label>
        </li>
        <li>
          <strong>Discpreancies:</strong>
          <ul>
            <li>
              <label>Discrepancies are students with information that do no match with a student database.</label>
            </li>
            <li>
              <label>The types are:</label>
              <ul>
                <li><strong>id</strong></li>
                <li><strong>first</strong></li>
                <li><strong>last</strong></li>
              </ul>
            </li>
            <li>
              <label>To see more inforamtion about a discrepancy, click the</label>&nbsp;
              <Image height='24' src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Infobox_info_icon.svg/1200px-Infobox_info_icon.svg.png'/>&nbsp;
              <label>Button.</label>
            </li>
            <li><label>Discrepancies may also be manually resolved, this is useful for cases like employee accounts, which will show as discrepant information because they won't be in a student database. Resolved discrepancies will always show information of who resolved a discrepancy, and a message for the reason.</label></li>
            <li><label>To resolve a discrepancy, you must be in have clicked the info button of a discrepancy, then click the <strong>Resolve</strong> button, enter name and reason then submit.</label></li>
          </ul>
        </li>
        <li>
          <label>Resolved discrepancies are now shown in the homepage, to show resolved discrepancies, click the </label>&nbsp;
          <Button style={{width: '6%', margin: '10px'}} variant='outline-danger'>Resolved</Button>&nbsp;
          <label>Button.</label>
        </li>
        <li>
          <label>To show help, click the <strong>?</strong> button.</label>
        </li>
      </ul>
    </SmallPage>
  )
}
