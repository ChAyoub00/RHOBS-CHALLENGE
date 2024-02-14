import React, { useState, useEffect } from 'react';
import './App.css'; // Importation du fichier de styles App.css

const App = () => {
  const [bodies, setBodies] = useState([]); // Liste de tous les corps célestes
  const [selectedBody, setSelectedBody] = useState(null); // Corps céleste sélectionné
  const [filteredBodies, setFilteredBodies] = useState([]); // Corps célestes filtrés en fonction des critères
  const [isPlanetChecked, setIsPlanetChecked] = useState(false); // Indique si la case à cocher "Est une planète" est cochée
  const [gravity, setGravity] = useState(0);  // Valeur de la gravité pour filtrer les corps célestes

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

// Fonction de filtrage des corps célestes
const filterBodies = () => {
    let filtered = bodies; 

    if (isPlanetChecked) {
      filtered = filtered.filter(body => body.isPlanet); // Si  on a coché le checkbox "isPlanet", on filtre sur les planètes
    }

    filtered = filtered.filter(body => body.gravity <= gravity); //  Filtre sur la gravité

    setFilteredBodies(filtered); //  Met à jour l'état filteredBodies
  };

  useEffect(() => {
    filterBodies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlanetChecked, gravity]);

  const handleBodySelect = (body) => { //  Gère le clic sur un corps céleste
    setSelectedBody(body);
  };

  const handlePlanetCheckboxChange = (event) => { // Gère le changement d'état du checkbox "isPlanet"
    setIsPlanetChecked(event.target.checked);
  };

  const handleGravityChange = (event) => { // Gère le changement de valeur de gravité
    setGravity(parseFloat(event.target.value));
  };

  return (
    <div className="app">
      <h1 className="header">RHOBS Challenge</h1>
      <div className="form-container">
          <label className="form-label">
            Is Planet:
            <input type="checkbox" checked={isPlanetChecked} onChange={handlePlanetCheckboxChange} />
          </label>
          <label className="form-label">
            Gravity:
            <input type="range" value={gravity} onChange={handleGravityChange} />
          </label>
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
