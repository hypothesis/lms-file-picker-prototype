import classnames from 'classnames';
import { h } from 'preact';
import propTypes from 'prop-types';

/**
 * Return the next item to select when advancing the selection by `amount` items
 * forwards (if positive) or backwards (if negative). The selection wraps to
 * the start or end of the list as necessary.
 */
function nextItem(items, item, amount) {
  const index = items.indexOf(item);
  if (index < 0) {
    return items[0];
  }

  let nextIndex = (index + amount) % items.length;
  if (nextIndex < 0) {
    nextIndex = items.length + nextIndex;
  }
  return items[nextIndex];
}

/**
 * An interactive table of items with a sticky header.
 */
export default function Table({
  columns,
  items,
  renderItem,
  selectedItem,
  onSelectItem,
  onUseItem,
}) {
  const onKeyDown = event => {
    let handled = false;
    if (event.key === 'Enter') {
      handled = true;
      onUseItem(selectedItem);
    } else if (event.key === 'ArrowUp') {
      handled = true;
      onSelectItem(nextItem(items, selectedItem, -1));
    } else if (event.key === 'ArrowDown') {
      handled = true;
      onSelectItem(nextItem(items, selectedItem, 1));
    }
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <div className="Table__wrapper">
      <table className="Table__table" tabIndex="0" onKeyDown={onKeyDown}>
        <thead className="Table__head">
          <tr>
            {columns.map(column => (
              <th key={column.label} className={column.className} scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="Table__body">
          {items.map(item => (
            <tr
              key={item.name}
              className={classnames({
                Table__row: true,
                'is-selected': selectedItem === item,
              })}
              onClick={() => onSelectItem(item)}
              onDblClick={() => onUseItem(item)}
            >
              {renderItem(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  /**
   * The columns to display in this table.
   */
  columns: propTypes.arrayOf(propTypes.shape({
    label: propTypes.string,
    className: propTypes.string,
  })),

  /**
   * The items to display in this table.
   */
  items: propTypes.arrayOf(propTypes.object),

  /**
   * A function called to render each item. The result should be a set of
   * `<td>` elements wrapped (one per column) wrapped inside a Fragment.
   */
  renderItem: propTypes.func,

  /**
   * The currently selected item from `items` or `null` if no item is
   * selected.
   */
  selectedItem: propTypes.object,

  /**
   * Callback invoked when the user changes the selected item.
   */
  onSelectItem: propTypes.func,

  /**
   * Callback invoked when a user chooses to use an item by double-clicking it
   * or pressing Enter while it is selected.
   */
  onUseItem: propTypes.func,
};
