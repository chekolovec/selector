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
}) => {
  const [isListShown, toggleList] = useState(false);
  const [isDragging, toggleDragging] = useState(false);
  const ref = useRef(null);

  const handleDeleteClick = useCallback(
    (event, selectedOption) => {
      event.stopPropagation();
      onSelectOption(
        selectedOptions.filter((option) => option.id !== selectedOption.id)
      );
    },
    [onSelectOption, selectedOptions]
  );

  const renderSelectedOption = useCallback(
    (option) => (
      <div className={classNames(styles.selectedOption)} key={option.id}>
        <p className={styles.label}>{option.label}</p>
        <div
          className={styles.deleteButton}
          onClick={(event) => handleDeleteClick(event, option)}
        >
          <IoClose />
        </div>
      </div>
    ),
    [handleDeleteClick]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target) && isListShown) {
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
      if (selectedOptions.includes(selectedOption)) {
        onSelectOption(
          selectedOptions.filter((option) => option.id !== selectedOption.id)
        );
        return;
      }
      onSelectOption([...selectedOptions, selectedOption]);
    },
    [onSelectOption, selectedOptions]
  );

  const handleDragStart = (event, option) => {
    event.dataTransfer.setData("drag-item", option.id);
    toggleDragging(true);
  };

  const handleDragEnd = useCallback(() => {
    toggleDragging(false);
  }, []);

  const handleDropEvent = useCallback(
    (event) => {
      const itemId = event.dataTransfer.getData("drag-item");
      const selectedOption = options.find((option) => option.id === itemId);
      if (selectedOption && !selectedOptions.includes(selectedOption)) {
        onSelectOption([...selectedOptions, selectedOption]);
      }
    },
    [onSelectOption, options, selectedOptions]
  );

  const renderOption = useCallback(
    (option) => {
      const isSelected = !!selectedOptions.find(
        (selected) => selected.id === option.id
      );

      return (
        <li
          key={option.label}
          draggable
          onDragStart={(event) => handleDragStart(event, option)}
          onDragEnd={handleDragEnd}
          className={classNames(styles.optionContainer, {
            [styles.active]: isSelected,
          })}
          onClick={() => handleSelect(option)}
        >
          {option.label}
        </li>
      );
    },
    [handleDragEnd, handleSelect, selectedOptions]
  );

  const handleClearClick = useCallback(
    (event) => {
      event.stopPropagation();
      onSelectOption([]);
    },
    [onSelectOption]
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
              onDrop={handleDropEvent}
              onDragOver={(event) => event.preventDefault()}
              className={styles.buttonMask}
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
