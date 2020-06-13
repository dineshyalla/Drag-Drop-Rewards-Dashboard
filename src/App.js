import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import uuid from 'react-uuid';

const itemsFromBackend = [
  { id: uuid(), content: 'R1', col1: true },
  { id: uuid(), content: 'R2', col1: true },
  { id: uuid(), content: 'R3', col1: true },
  { id: uuid(), content: 'R4', col1: true },
];

const columnsFromBackend = {
  [uuid()]: {
    name: 'Rewards',
    items: itemsFromBackend,
  },
  [uuid()]: {
    name: 'C1',
    items: [],
  },
  [uuid()]: {
    name: 'C2',
    items: [],
  },
  [uuid()]: {
    name: 'C3',
    items: [],
  },
  [uuid()]: {
    name: 'C4',
    items: [],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  //console.log(result);
  if (!result.destination) return;
  const { source, destination } = result;
  console.log(result);
  const sourceColumn = columns[source.droppableId];
  const destColumn = columns[destination.droppableId];
  const sourceItems = [...sourceColumn.items];
  const destItems = [...destColumn.items];

  console.log('source items of Columnid ' + JSON.stringify(sourceItems));
  console.log('destination items of Columnid ' + JSON.stringify(destItems));

  //console.log(JSON.stringify(sourceItems[source.index]));

  //when draggable item is from 1st column
  if (
    source.droppableId !== destination.droppableId &&
    !sourceItems[source.index].col1
  ) {
    //console.log(result);
    console.log('NOT FIRST COLUMN');
    const [removed] = sourceItems.splice(source.index, 1);
    removed.col1 = false;

    removed.id = uuid();

    destItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  }
  //when draggable item is from 2nd column
  else if (source.droppableId !== destination.droppableId) {
    //console.log(result);
    console.log('YAAS FIRST COLUMN');

    const [removed] = sourceItems.slice(source.index, source.index + 1);
    removed.col1 = false;

    removed.id = uuid();

    destItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  }
};

function App() {
  const [columns, setColumns] = useState(columnsFromBackend);
  const [items, setItems] = useState(itemsFromBackend);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([id, column]) => {
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? 'lightblue'
                            : 'lightgrey',
                          padding: 4,
                          width: 250,
                          minHeight: 500,
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: 'none',
                                      padding: 16,
                                      margin: '0 0 8px 0',
                                      minHeight: '50px',
                                      backgroundColor: snapshot.isDragging
                                        ? '#263B4A'
                                        : '#456C86',
                                      color: 'white',
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
