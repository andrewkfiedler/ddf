/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/

import * as React from 'react'

const doubleClickTime = 500 // how soon a user has to click for it to be a double click
const textSelectionTime = 500 // how long a user has to hold down mousebutton for us to recognize it as wanting to do text selection

function getMaxIndex(selectionInterface: any) {
  const selectedResults = selectionInterface.getSelectedResults()
  const completeResults = selectionInterface.getActiveSearchResults()
  return selectedResults.reduce(
    (maxIndex: any, result: any) =>
      Math.max(maxIndex, completeResults.indexOf(result)),
    -1
  )
}

function getMinIndex(selectionInterface: any) {
  const selectedResults = selectionInterface.getSelectedResults()
  const completeResults = selectionInterface.getActiveSearchResults()
  return selectedResults.reduce(
    (minIndex: any, result: any) =>
      Math.min(minIndex, completeResults.indexOf(result)),
    completeResults.length
  )
}

type Props = {
  selectionInterface: any
}

function useSelection({ selectionInterface }: Props) {
  let lastTarget = undefined as any
  let lastMouseDown = Date.now()
  let lastClick = Date.now()
  const updateStateOnClick = (event: React.MouseEvent) => {
    lastTarget = event.currentTarget
    lastClick = Date.now()
  }
  const interpretClick = (event: React.MouseEvent) => {
    if (event.altKey || isTextSelection() || isDoubleClick(event)) {
      return
    }
    const resultid = event.currentTarget.getAttribute('data-resultid') as string
    const selectedResults = selectionInterface.getSelectedResults()
    const alreadySelected = selectedResults.get(resultid) !== undefined
    const onlySelected = selectedResults.length === 1
    //shift key wins over all else
    if (event.shiftKey) {
      handleShiftClick(resultid, alreadySelected)
    } else if (event.ctrlKey || event.metaKey) {
      handleControlClick(resultid, alreadySelected)
    } else {
      selectionInterface.clearSelectedResults()
      handleControlClick(resultid, alreadySelected && onlySelected)
    }
  }

  const handleShiftClick = (resultid: string, alreadySelected: boolean) => {
    const selectedResults = selectionInterface.getSelectedResults()
    const indexClicked = selectionInterface
      .getActiveSearchResults()
      .indexOfId(resultid)
    const firstIndex = getMinIndex(selectionInterface)
    const lastIndex = getMaxIndex(selectionInterface)
    if (selectedResults.length === 0) {
      handleControlClick(resultid, alreadySelected)
    } else if (indexClicked <= firstIndex) {
      selectBetween(indexClicked, firstIndex)
    } else if (indexClicked >= lastIndex) {
      selectBetween(lastIndex, indexClicked + 1)
    } else {
      selectBetween(firstIndex, indexClicked + 1)
    }
  }

  const selectBetween = (startIndex: number, endIndex: number) => {
    selectionInterface.addSelectedResult(
      selectionInterface.getActiveSearchResults().slice(startIndex, endIndex)
    )
  }

  const handleControlClick = (resultid: string, alreadySelected: boolean) => {
    if (alreadySelected) {
      selectionInterface.removeSelectedResult(
        selectionInterface.getActiveSearchResults().get(resultid)
      )
    } else {
      selectionInterface.addSelectedResult(
        selectionInterface.getActiveSearchResults().get(resultid)
      )
    }
  }

  const isDoubleClick = (event: React.MouseEvent) => {
    return (
      lastTarget === event.currentTarget &&
      Date.now() - lastClick < doubleClickTime
    )
  }

  const isTextSelection = () => {
    return Date.now() - lastMouseDown > textSelectionTime
  }

  const updateStateOnMouseDown = () => {
    lastMouseDown = Date.now()
  }

  const interpretMouseDown = (event: React.MouseEvent) => {
    if (event.altKey) {
      return
    }
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      isDoubleClick(event)
    ) {
      event.preventDefault()
    }
  }

  return {
    handleClick: (event: React.MouseEvent) => {
      interpretClick(event)
      updateStateOnClick(event)
    },
    handleMouseDown: (event: React.MouseEvent) => {
      interpretMouseDown(event)
      updateStateOnMouseDown()
    },
  }
}

export default useSelection
