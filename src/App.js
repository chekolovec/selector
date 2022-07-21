import { useState } from "react";
import "./App.scss";
import { CustomSelect } from "./components/CustomSelect";

const OPTIONS = [
  {
    label: "test1",
    id: "test1",
  },
  {
    label: "test2",
    id: "test2",
  },
  {
    label: "test3",
    id: "test3",
  },
  {
    label: "test4",
    id: "test4",
  },
  {
    label: "test5",
    id: "test5",
  },
  {
    label: "test6",
    id: "test6",
  },
  {
    label: "test7",
    id: "test7",
  },
  {
    label: "test8",
    id: "test8",
  },
];

function App() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  return (
    <div className="App">
      <CustomSelect
        options={OPTIONS}
        selectedOptions={selectedOptions}
        onSelectOption={setSelectedOptions}
      />
    </div>
  );
}

export default App;
