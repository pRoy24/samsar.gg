import React, { useEffect, useState } from 'react';


import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});




export default function LayersDisplay(props: any) {

  console.log(props);
  const { activeItemList, setActiveItemList } = props;

  console.log("EEETTE");


  const onDragEnd = result => {
    // dropped outside the list

    console.log("REORDER");

    console.log(result);
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      activeItemList,
      result.source.index,
      result.destination.index
    );

    console.log("SINIGH REORDER");
    console.log(newItems);

    setActiveItemList(newItems);

  };
  

  return (
    <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="droppable">
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
        >
          {activeItemList.map(function(item, index) {

            const itemId = `list_item_${item.id}`;
            console.log(itemId);
            const itemContent = `item ${item.id} - ${item.type}`
            return (
              <Draggable key={item.id} draggableId={itemId} index={index} id={itemId}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}
                >
                  {itemContent}
                </div>
              )}
            </Draggable>           
            )
          })}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
  );
}