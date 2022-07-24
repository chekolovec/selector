import { useState } from "react";
import "./App.scss";
import { CustomSelect } from "./components/CustomSelect";

const OPTIONS = [
  {
    name: "test1",
    index: "test1",
  },
  {
    name: "test2",
    index: "test2",
  },
  {
    name: "test3",
    index: "test3",
  },
  {
    name: "test4",
    index: "test4",
  },
  {
    name: "test5",
    index: "test5",
  },
  {
    name: "test6",
    index: "test6",
  },
  {
    name: "test7",
    index: "test7",
  },
  {
    name: "test8",
    index: "test8",
  },
];

function App() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  return (
    <div className="App">
      <CustomSelect
        options={OPTIONS}
        getId={(option) => option.index}
        getLabel={(option) => option.name}
        selectedOptions={selectedOptions}
        onSelectOption={setSelectedOptions}
      />
    </div>
  );
}

export default App;
