import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './App.css'; 

const App = () => {
  const {register, watch} = useForm();
  const [bodies, setBodies] = useState([]); 
  const [selectedBody, setSelectedBody] = useState(null); 
  const [filteredBodies, setFilteredBodies] = useState([]); 

  useEffect(() => {
    fetchBodies();
  }, []);

// Fonction asynchrone pour récupérer les données des corps célestes depuis l'API
const fetchBodies = async () => {
    try {
      const response = await fetch('https://api.le-systeme-solaire.net/rest/bodies');
      const data = await response.json();
      setBodies(data.bodies); // Met à jour l'état bodies avec les données récupérées
    } catch (error) {
      console.error('Error fetching bodies:', error);  //Gestion des erreurs
    }
  };

  useEffect(() => {
    filterBodies();
  }, [watch("isPlanetChecked"), watch("gravity")]);

  const filterBodies = () => {
    let filtered = bodies.slice(); 

    if (watch("isPlanetChecked")) {
      filtered = filtered.filter(body => body.isPlanet);
    }

    filtered = filtered.filter(body => body.gravity <= watch("gravity"));

    setFilteredBodies(filtered);
  };

  const handleBodySelect = (body) => { //  Gère le clic sur un corps céleste
    setSelectedBody(body);
  };

  return (
    <div className="app">
      <h1 className="header">RHOBS Challenge</h1>
      <div className="form-container">
        <form>
          <label className="form-label">
            Is Planet:
            <input type="checkbox" {...register("isPlanetChecked")} />
          </label>
          <label className="form-label">
            Gravity:
            <input type="range" {...register("gravity")} />
          </label>
        </form>
      </div>
      <div className="select-container">
        <label className="select-label"> Bodies: 
        <select className="select-list" onChange={(e) => {
            const value = e.target.value;
            if (value) {
                handleBodySelect(JSON.parse(value));
            } else {
                setSelectedBody(null);
            }
            }}>          
            
            <option value="">Select a body</option>
          {filteredBodies.map((body) => (
            <option value={JSON.stringify(body)}>  {body.name}  </option>
          ))}
        </select>
        </label>
      </div>
      <div className="body-info-container">
        {selectedBody && (
          <div>
            <h2 className="info-header">Informations about the body:</h2>
            <p><strong>Name:</strong> {selectedBody.name}</p>
            <p><strong>Type:</strong> {selectedBody.isPlanet ? 'Planet' : 'Not a Planet'}</p>
            <p><strong>Gravity:</strong> {selectedBody.gravity}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
