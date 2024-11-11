import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Formtable from './components/Formtable';
import './App.css';
import { MdClose } from "react-icons/md";

axios.defaults.baseURL = "http://localhost:8080/";

function App() {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    _id: ""
  });

  const [formDataEdit, setFormDataEdit] = useState({
    name: "",
    email: "",
    mobile: "",
    _id: ""
  });

  const [dataList, setDataList] = useState([]);

  const handleOnchange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditOnchange = (e) => {
    const { value, name } = e.target;
    setFormDataEdit((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { _id, ...dataWithoutId } = formData; // Exclude _id from formData
    const data = await axios.post("/create", dataWithoutId);
    console.log(data);
    if (data.data.success) {
        setAddSection(false);
        alert(data.data.message);
        getFetchData();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = await axios.put("/update", formDataEdit);
    if (data.data.success) {
        setEditSection(false);
        getFetchData();
        alert(data.data.message);
        setEditSection(false);
        setFormData({
          name: "",
          email: "",
          mobile: ""
        });
    }
  };

  const getFetchData = async () => {
    const data = await axios.get("/");
    console.log(data);
    if (data.data.success) {
        setDataList(data.data.data);
    }
  };

  useEffect(() => {
    getFetchData();
  }, []);

  const handleDelete = async (id) => {
    const data = await axios.delete("/delete/" + id);
    if (data.data.success) {
        getFetchData();
        alert(data.data.message);
    }
  };

  const handleEdit = (el) => {
    setFormDataEdit(el);
    setEditSection(true);
  };

  return (
    <>
      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>Add</button>
        {addSection && (
          <Formtable
            handleSubmit={handleSubmit}
            handleOnchange={handleOnchange}
            handleclose={() => setAddSection(false)}
            rest={formData}
          />
        )}
        {editSection && (
          <Formtable
            handleSubmit={handleUpdate}
            handleOnchange={handleEditOnchange}
            handleclose={() => setEditSection(false)}
            rest={formDataEdit}
          />
        )}
        <div className='tableContainer'>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dataList[0] ? (
                dataList.map((el) => {
                  console.log(el);
                  return (
                    <tr key={el._id}>
                      <td>{el.name}</td>
                      <td>{el.email}</td>
                      <td>{el.mobile}</td>
                      <td>
                        <button className='btn btn-edit' onClick={() => handleEdit(el)}>Edit</button>
                        <button className='btn btn-delete' onClick={() => handleDelete(el._id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <p style={{ textAlign: "center" }}>No data</p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
