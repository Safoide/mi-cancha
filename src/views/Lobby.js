import React, { useState, useEffect } from "react";
import NavAll from "../components/Nav";
import Footer from "../components/footer.js";

function Lobby() {
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [pricePerCourt, setPricePerCourt] = useState(0);
  const [costPerPlayer, setCostPerPlayer] = useState(0);
  const [playerNames, setPlayerNames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [sportType, setSportType] = useState("");

  const handleTotalPlayersChange = (event) => {
    setTotalPlayers(parseInt(event.target.value));
  };

  const handlePricePerCourtChange = (event) => {
    setPricePerCourt(parseFloat(event.target.value));
  };

  const handlePlayerNameChange = (index, event) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = event.target.value;
    setPlayerNames(newPlayerNames);
  };

  const addPlayerField = () => {
    const newPlayerNames = [...playerNames];
    newPlayerNames.push("");
    setPlayerNames(newPlayerNames);
  };

  const removePlayerField = (index) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames.splice(index, 1);
    setPlayerNames(newPlayerNames);
  };

  const calculateCostPerPlayer = () => {
    if (totalPlayers > 0) {
      const cost = pricePerCourt / totalPlayers;
      setCostPerPlayer(cost);
    }
  };

  const shufflePlayers = () => {
    const nonEmptyPlayerNames = playerNames.filter(name => name.trim() !== '');

    if (nonEmptyPlayerNames.length < 2) {
      setErrorMessage('Debes tener al menos dos jugadores para mezclar equipos.');
      return;
    }

    setErrorMessage("");

    const shuffledPlayers = [...nonEmptyPlayerNames].sort(() => Math.random() - 0.5);
    const halfLength = Math.ceil(shuffledPlayers.length / 2);
    const team1 = shuffledPlayers.slice(0, halfLength);
    const team2 = shuffledPlayers.slice(halfLength);
    setTeams([team1, team2]);
  };

  const movePlayer = (playerIndex, fromTeamIndex, toTeamIndex) => {
    const newTeams = [...teams];
    const playerToMove = newTeams[fromTeamIndex][playerIndex];
    newTeams[fromTeamIndex].splice(playerIndex, 1);
    newTeams[toTeamIndex].push(playerToMove);
    setTeams(newTeams);
  };

  const clearTeams = () => {
    setTeams([]);
  };

  const handleSportTypeChange = (event) => {
    setSportType(event.target.value);
  };

  useEffect(() => {
    switch (sportType) {
      case "futbol 5":
        setTotalPlayers(10);
        break;
      case "padel":
        setTotalPlayers(4);
        break;
      case "futbol 7":
        setTotalPlayers(14);
        break;
      case "tenis doble":
        setTotalPlayers(4);
        break;
      case "basquet":
        setTotalPlayers(10);
        break;
      default:
        setTotalPlayers(0);
    }

    const initialPlayerNames = Array.from({ length: totalPlayers }, () => "");
    setPlayerNames(initialPlayerNames);
  }, [sportType]);

  return (
    <div className="lobby-container">
      <NavAll />
      <div className="container">
        <div className="row">
          <div className="col-md-12 mb-4 ms-3">
            <h2 className="tahomaTittle display-6 text-center mt-0">Lobby</h2>
            
          </div>
        </div>

        <div className="row">
          <div className="lobby-content fondoBlanco col-md-12 mb-4 ms-3">
          <div className="ps-3">
              <label className=" fs-4 fw-bold mb-2">Tipo de deporte:</label>
              <select
                className="form-select w-25 ms-0 mb-3"
                value={sportType}
                onChange={handleSportTypeChange}
              >
                <option value="">Seleccione...</option>
                <option value="futbol 5">Fútbol 5</option>
                <option value="padel">Padel</option>
                <option value="futbol 7">Fútbol 7</option>
                <option value="tenis doble">Tenis doble</option>
                <option value="basquet">Básquet</option>
              </select>
            </div>
            <div className=" row ps-4">
              <div className="col-md-5">
                <h3>Mezclador de equipos</h3>
                <div className="player-names">
                  {[...Array(totalPlayers)].map((_, index) => (
                    <div key={index} className="player-field">
                      <input
                        className="form-input w-50 me-2 mb-2"
                        type="text"
                        value={playerNames[index] || ""}
                        onChange={(e) => handlePlayerNameChange(index, e)}
                        placeholder={`Nombre del jugador ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removePlayerField(index)}
                        className="remove-button"
                      >
                        <i class="fa-solid fa-broom"></i>
                      </button>
                      
                    </div>
                  ))}
                  
                </div>
                <button className="mix-button mt-3" type="button" onClick={shufflePlayers}>
                  <i className="fa-solid fa-shuffle"></i> Mezclar
                </button>
                <div className="error-message mt-3">{errorMessage}</div>
              </div>

              <div className="col-md-7">
                <h3>Equipos</h3>
                {teams.length > 0 && (
                  <div>
                    <div>
                      <button className="remove-button" onClick={clearTeams}>
                        <i className="fa-solid fa-trash"></i> Borrar equipos
                      </button>
                    </div>
                    <div className="d-flex align-items-start"> 
                      <div className="me-3">
                        <strong>Equipo 1:</strong>
                        <ol className="team-list">
                          {teams[0].map((player, index) => (
                            <li key={index} className="team1-item">
                              {player}
                              <button
                                type="button"
                                onClick={() => movePlayer(index, 0, 1)}
                                className="move-button"
                              >
                                <i class="fa-solid fa-arrow-right"></i>
                              </button>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <strong>Equipo 2:</strong>
                        <ol className="team-list">
                          {teams[1].map((player, index) => (
                            <li key={index} className="team2-item">
                              {player}
                              <button
                                type="button"
                                onClick={() => movePlayer(index, 1, 0)}
                                className="move-button"
                              >
                                <i class="fa-solid fa-arrow-left"></i>
                              </button>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3 mb-5">
          <div className="lobby-content fondoBlanco col-md-12 mb-4 ms-3">
            <div className="ms-4 mb-4">
              <h3 className="">Calculadora</h3>
              
              <form className="lobby-form">
                <div className="row">
                    <label className="form-label fw-bold">Precio total de la cancha ($):</label>
                  <div className="col-12 d-flex align-items-center">
                    <input
                      className="form-input w-25"
                      type="number"
                      step="0.01"
                      value={pricePerCourt}
                      onChange={handlePricePerCourtChange}
                    />
                    <button className="form-button ms-3" type="button" onClick={calculateCostPerPlayer}>
                    <i class="fa-solid fa-calculator"></i>  Calcular
                    </button>
                    {costPerPlayer > 0 && (
                      <p className="mb-0 text-center ms-4 justify-content-center">Costo por jugador ${costPerPlayer.toFixed(2)}</p>
                  )}
                  </div>

                
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Lobby;