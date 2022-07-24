import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import { useCallback } from "react";
import { useState } from "react";
import styles from "./styles.module.scss";
import { IoClose, IoChevronDown } from "react-icons/io5";

export const CustomSelect = ({
  options = [],
  selectedOptions = [],
  onSelectOption = () => {},
  getId = (option) => option.id,
  getLabel = (option) => option.label,
}) => {
  const [isListShown, toggleList] = useState(false);
  const [isDragging, toggleDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOverSelector, setDragOverSelector] = useState(null);
  const ref = useRef(null);

  const handleDeleteClick = useCallback(
    (event, selectedOption) => {
      event.stopPropagation();
      onSelectOption(
        selectedOptions.filter((optionId) => optionId !== getId(selectedOption))
      );
    },
    [getId, onSelectOption, selectedOptions]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isListShown && ref.current && !ref.current.contains(event.target)) {
        toggleList(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [isListShown]);

  const handleSelect = useCallback(
    (selectedOption) => {
      toggleList(false);
      if (selectedOptions.includes(getId(selectedOption))) {
        onSelectOption(
          selectedOptions.filter(
            (optionId) => optionId !== getId(selectedOption)
          )
        );
        return;
      }
      onSelectOption([...selectedOptions, getId(selectedOption)]);
    },
    [getId, onSelectOption, selectedOptions]
  );

  const handleDragStart = useCallback(
    (event, option) => {
      event.dataTransfer.setData("drag-item", getId(option));
      toggleDragging(true);
    },
    [getId]
  );

  const handleDragEnd = useCallback(() => {
    toggleDragging(false);
    setDragOverIndex(null);
    setDragOverSelector(null);
  }, []);

  const handleDropEvent = useCallback(
    ({ event, index, last }) => {
      const itemId = event.dataTransfer.getData("drag-item");
      const oldIndex = selectedOptions.findIndex(
        (element) => element === itemId
      );
      if (itemId && last) {
        selectedOptions.splice(oldIndex, 1);
        onSelectOption([...selectedOptions, itemId]);
        return;
      }
      if (itemId) {
        selectedOptions.splice(oldIndex, 1);
        selectedOptions.splice(oldIndex < index ? index - 1 : index, 0, itemId);
        onSelectOption([...selectedOptions]);
      }
    },
    [onSelectOption, selectedOptions]
  );

  const handleDragEnter = useCallback((optionId) => {
    setTimeout(() => {
      setDragOverIndex(optionId);
    }, 0);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const renderOption = useCallback(
    (option) => {
      const isSelected = !!selectedOptions.find(
        (selectedId) => selectedId === getId(option)
      );

      return (
        <li
          key={getId(option)}
          className={classNames(styles.optionContainer, {
            [styles.active]: isSelected,
          })}
          onClick={() => handleSelect(option)}
        >
          {getLabel(option)}
        </li>
      );
    },
    [getId, getLabel, handleSelect, selectedOptions]
  );

  const handleClearClick = useCallback(
    (event) => {
      event.stopPropagation();
      onSelectOption([]);
    },
    [onSelectOption]
  );

  const renderSelectedOption = useCallback(
    (optionId, index) => {
      const option = options.find((item) => getId(item) === optionId);
      return (
        <div
          className={classNames(styles.selectedOptionContainer, {
            [styles.draggedOver]: optionId === dragOverIndex,
            [styles.draggedOverLast]:
              index === selectedOptions.length - 1 && dragOverSelector,
          })}
          draggable
          onDragStart={(event) => handleDragStart(event, option)}
          onDragEnd={handleDragEnd}
          key={optionId}
        >
          <div className={classNames(styles.selectedOption)}>
            <p className={styles.label}>{getLabel(option)}</p>
            <div
              className={styles.deleteButton}
              onClick={(event) => handleDeleteClick(event, option)}
            >
              <IoClose />
            </div>
          </div>
          {isDragging && (
            <div
              onDrop={(event) => handleDropEvent({ event, index })}
              onDragOver={(event) => event.preventDefault()}
              onDragEnter={() => handleDragEnter(optionId)}
              onDragLeave={handleDragLeave}
              className={classNames(styles.mask, styles.selectedMask)}
            ></div>
          )}
        </div>
      );
    },
    [
      dragOverIndex,
      dragOverSelector,
      getId,
      getLabel,
      handleDeleteClick,
      handleDragEnd,
      handleDragEnter,
      handleDragLeave,
      handleDragStart,
      handleDropEvent,
      isDragging,
      options,
      selectedOptions.length,
    ]
  );

  return (
    <div ref={ref} className={classNames(styles.container)}>
      <button
        className={classNames(styles.selectButton)}
        onClick={() => {
          toggleList(!isListShown);
        }}
      >
        <div
          className={classNames(styles.selectContainer, {
            [styles.active]: isListShown,
          })}
        >
          <div className={styles.selectedOptionsContainer}>
            {selectedOptions.length ? (
              selectedOptions.map(renderSelectedOption)
            ) : (
              <div className={styles.placeholderContainer}>
                <p className={styles.placeholder}>Select...</p>
              </div>
            )}
          </div>
          <div className={styles.clearContainer} onClick={handleClearClick}>
            <IoClose />
          </div>
          <div className={styles.chevronContainer}>
            <IoChevronDown />
          </div>
          {isDragging && (
            <div
              onDragEnter={() => setDragOverSelector(true)}
              onDragLeave={() => setDragOverSelector(false)}
              onDrop={(event) => handleDropEvent({ event, last: true })}
              onDragOver={(event) => event.preventDefault()}
              className={classNames(styles.mask, styles.buttonMask)}
            ></div>
          )}
        </div>
      </button>
      {isListShown && (
        <ul className={styles.optionsContainer}>{options.map(renderOption)}</ul>
      )}
    </div>
  );
};
