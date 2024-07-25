import React from 'react'

function isPrintable(object) {
  return typeof object != "object"
}

export default function ObjectPropertiesList({ object }) {
	function recurse(object, parent, depth) {
    if (object === null) {
      return <li><i>null/None</i></li>
    }

    if (isPrintable(object)) {
      return <strong>{object}</strong>
    }

    let tabs = ""
    for (let i = 0; i < tabs; i++) {
      tabs += '\t'
    }

		return (
      <>
        {
          Object.keys(object).map(key => {
            const value = object[key]
            const childKey = `${parent}${parent === "" ? "" : "."}${key}`
            if (isPrintable(value)) {
              return (
                <li key={`${object}.${parent}.${key}`}>
                  {
                    value.constructor === Array ?
                    <ol>
                      {
                        value.map((valueItem, index) => (<li key={`Array(${childKey})[${index}]`}>{recurse(valueItem, childKey, depth + 1)}</li>))
                      }
                    </ol> :
                    <>
                      <strong>{key} </strong><label>{`${value}`}</label>
                    </>
                  }
                </li>
              )
            } else {
              return (
                <>
                  <li><strong>{key}</strong></li>
                  <ul>
                    {recurse(object[key], childKey, depth + 1)}
                  </ul>
                </>
              )
            }
          })
        }
      </>
		)
	}

	return (
		<ul>
      {
        recurse(object, "", 0)
      }
		</ul>
	)
}
