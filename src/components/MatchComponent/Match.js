import axios from "axios";
import { data } from "flickity";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAPI } from "../../api";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import LoadingAction from "../LoadingComponent/LoadingAction";
import Livestream from "./Livestream";
import MatchDetail from "./MatchDetail";
import styles from "./styles/style.module.css";
import { useNavigate } from "react-router-dom";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { getMatchDetailByMatchIdAPI } from "../../api/MatchDetailAPI";
function Match() {
  const location = useLocation();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [guestId, setGuestId] = useState(localStorage.getItem("guestId"));
  // location.state.hostTournamentId
  useEffect(() => {
    // joinRoom();
  }, []);
  const navigate = useNavigate();
  const { idMatch } = useParams();
  const [allTeamA, setAllTeamA] = useState(null);
  const [allTeamB, setAllTeamB] = useState(null);
  const [playerRegisterA, setPlayerRegisterA] = useState(null);
  const [playerRegisterB, setPlayerRegisterB] = useState(null);
  const [tournamentID, setTournamentID] = useState(0);
  const [footballFeild, setFootballFeild] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenLivestream, setTokenLivestream] = useState("");
  const [check, setCheck] = useState(false);

  const [popupUpdateMatch, setPopupUpdateMatch] = useState(false);
  // update Player
  const [playerScoreA, setplayerScoreA] = useState([]);
  const [playerScoreB, setPlayerScoreB] = useState([]);

  //
  const [scoreTeamA, setScoreTeamA] = useState({ value: 0, error: "" });
  const [scoreTeamB, setScoreTeamB] = useState({ value: 0, error: "" });
  const [redTeamA, setRedTeamA] = useState({ value: 0, error: "" });
  const [redTeamB, setRedTeamB] = useState({ value: 0, error: "" });
  const [yellowTeamA, setYellowTeamA] = useState({ value: 0, error: "" });
  const [yellowTeamB, setYellowTeamB] = useState({ value: 0, error: "" });
  const getMatch = () => {
    console.log("test")
    setLoading(true);
    let afterURL = `TeamInMatch/matchId?matchId=${idMatch}`;
    let response = getAPI(afterURL);
    response
      .then((res) => {
        const allMatch = res.data.teamsInMatch;
        
        if (allMatch[0].teamScore > 0 || allMatch[0].teamScore > 0) {
          getDataMatchDetail(allMatch[0].matchId,allMatch[0],allMatch[1]);
        }
        const teamB = [];
        const teamA = allMatch.reduce((accumulator, currentValue) => {
          if (currentValue.id % 2 === 1) {
            accumulator.push(currentValue);
          } else {
            teamB.push(currentValue);
          }
          return accumulator;
        }, []);

        
        setAllTeamA(teamA);
        setAllTeamB(teamB);
        setScoreTeamA({ value: res.data.teamsInMatch[0].teamScore });
        setScoreTeamB({ value: res.data.teamsInMatch[1].teamScore });
        setRedTeamA({ value: res.data.teamsInMatch[1].redCardNumber });
        setRedTeamB({ value: res.data.teamsInMatch[1].redCardNumber });
        setYellowTeamA({ value: res.data.teamsInMatch[1].yellowCardNumber });
        setYellowTeamB({ value: res.data.teamsInMatch[1].yellowCardNumber });
        setTournamentID(res.data.teamsInMatch[0].match.tournamentId);
        setTokenLivestream(res.data.teamsInMatch[0].match.tokenLivestream);
        getTourDetail(res.data.teamsInMatch[0].match.tournamentId);
        setLoading(false);
        
        // getAllPlayerByTeamIdA(
        //   res.data.teamsInMatch[0].teamInTournament.team.id,
        //   res.data.teamsInMatch[0].teamInTournament.id
        // );
        // getAllPlayerByTeamIdB(
        //   res.data.teamsInMatch[1].teamInTournament.team.id,
        //   res.data.teamsInMatch[1].teamInTournament.id
        // );
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const getDataMatchDetail = (data,teamA,teamB) => {
    const response = getMatchDetailByMatchIdAPI(data);
    response
      .then((res) => {
        const matchDetail = res.data.matchDetails;
        devidedPlayerScore(matchDetail,teamA,teamB);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const devidedPlayerScore = (data,teamA,teamB) => {
   
      const newTeamA = teamA;
      const newTeamB = teamB;
      const idteamA = newTeamA.teamInTournament.team.id;
      const idteamB = newTeamB.teamInTournament.team.id;
      
      const playerScoreA = [];
      for (let item of data) {
        if (item.playerInTournament.playerInTeam.teamId === idteamA) {
          if (playerScoreA.length > 0) {
            const index = playerScoreA.findIndex(
              (itemIn) =>
                itemIn.idPlayerInTournament === item.playerInTournament.id
            );
            if (index === -1) {
              playerScoreA.push({
                idPlayerInTournament: item.playerInTournament.id,
                namePlayer:
                  item.playerInTournament.playerInTeam.footballPlayer
                    .playerName,
                minutesScore: [item.actionMinute],
              });
            } else {
              playerScoreA[index].minutesScore.push(item.actionMinute);
            }
          } else {
            playerScoreA.push({
              idPlayerInTournament: item.playerInTournament.id,
              namePlayer:
                item.playerInTournament.playerInTeam.footballPlayer.playerName,
              minutesScore: [item.actionMinute],
            });
          }
        }
      }
      console.log(playerScoreA);
      const playerScoreB = [];
      for (let item of data) {
        if (item.playerInTournament.playerInTeam.teamId === idteamB) {
          if (playerScoreA.length > 0) {
            const index = playerScoreA.findIndex(
              (itemIn) =>
                itemIn.idPlayerInTournament === item.playerInTournament.id
            );
            if (index === -1) {
              playerScoreB.push({
                idPlayerInTournament: item.playerInTournament.id,
                namePlayer:
                  item.playerInTournament.playerInTeam.footballPlayer
                    .playerName,
                minutesScore: [item.actionMinute],
              });
            } else {
              playerScoreB[index].minutesScore.push(item.actionMinute);
            }
          } else {
            playerScoreB.push({
              idPlayerInTournament: item.playerInTournament.id,
              namePlayer:
                item.playerInTournament.playerInTeam.footballPlayer.playerName,
              minutesScore: [item.actionMinute],
            });
          }
        }
      }
      console.log(playerScoreB);
  };
  // const getAllPlayerByTeamIdA = (teamId, teamInTournamentId) => {
  //   setLoading(true);
  //   const response = getAllPlayerByTeamIdAPI(teamId);
  //   response
  //     .then((res) => {
  //       console.log(res.data);
  //       getAllPlayerInTournamentByTeamInTournamentIdA(
  //         res.data.playerInTeamsFull,
  //         teamInTournamentId
  //       );
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       console.error(err);
  //     });
  // };
  // const getAllPlayerByTeamIdB = (teamId, teamInTournamentId) => {
  //   setLoading(true);
  //   const response = getAllPlayerByTeamIdAPI(teamId);
  //   response
  //     .then((res) => {
  //       console.log(res.data);
  //       getAllPlayerInTournamentByTeamInTournamentIdB(
  //         res.data.playerInTeamsFull,
  //         teamInTournamentId
  //       );
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       console.error(err);
  //     });
  // };
  // const getAllPlayerInTournamentByTeamInTournamentIdA = async (
  //   data,
  //   teamInTournamentId
  // ) => {
  //   const newPlayerRegister = [];
  //   // Sửa API lai jum
  //   const response = await getAllPlayerInTournamentByTeamInTournamentIdAPI(50);

  //   if (response.status === 200) {
  //     for (const item of response.data.playerInTournaments) {
  //       const findNewPlayer = data.find(
  //         (itemData) => itemData.id === item.playerInTeamId
  //       );
  //       findNewPlayer.clothesNumber = item.clothesNumber;
  //       newPlayerRegister.push(findNewPlayer);
  //     }
  //     setPlayerRegisterA(newPlayerRegister);
  //     setLoading(false);
  //   }
  // };
  // const getAllPlayerInTournamentByTeamInTournamentIdB = async (
  //   data,
  //   teamInTournamentId
  // ) => {
  //   const newPlayerRegisterB = [];
  //   // Sửa API lai jum
  //   const response = await getAllPlayerInTournamentByTeamInTournamentIdAPI(49);

  //   if (response.status === 200) {
  //     for (const item of response.data.playerInTournaments) {
  //       const findNewPlayer = data.find(
  //         (itemData) => itemData.id === item.playerInTeamId
  //       );
  //       findNewPlayer.clothesNumber = item.clothesNumber;
  //       newPlayerRegisterB.push(findNewPlayer);
  //     }
  //     setPlayerRegisterB(newPlayerRegisterB);
  //     setLoading(false);
  //   }
  // };
  const getTourDetail = async (id) => {
    let afterDefaultURL = `tournaments/${id}`;
    let response = getAPI(afterDefaultURL);
    response
      .then((res) => {
        setFootballFeild(res.data.footballFieldAddress);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    getMatch();
  }, [check]);

  const [activeTeamDetail, setActiveTeamDetail] = useState(location.pathname);
  const renderByLink = () => {
    if (activeTeamDetail === `/match/${idMatch}/matchDetail`) {
      return (
        <MatchDetail
          allTeamA={allTeamA}
          allTeamB={allTeamB}
          footballFeild={footballFeild}
        />
      );
    }
    if (activeTeamDetail === `/match/${idMatch}/livestream`) {
      return (
        <Livestream
          idMatch={idMatch}
          tokenLivestream={tokenLivestream}
          sendComment={sendComment}
          message={message}
        />
      );
    }
  };

  const getStatusMatch = (matchStatus) => {
    if (matchStatus === "Not start") {
      return <p style={{ fontStyle: "italic" }}>Chưa diễn ra</p>;
    } else if (matchStatus === "Start") {
      return <p style={{ color: "green" }}>Đã diễn ra</p>;
    } else {
      return <p style={{ color: "red" }}>Đã kết thúc</p>;
    }
  };

  const formatDateTime = (date) => {
    const day = new Date(date);
    return (
      String(day.getDate()).padStart(2, "0") +
      "/" +
      String(day.getMonth() + 1).padStart(2, "0") +
      "/" +
      day.getFullYear() +
      " " +
      String(day.getHours()).padStart(2, "0") +
      ":" +
      String(day.getMinutes()).padStart(2, "0")
    );
  };

  const updateTeamA = async (
    id,
    teamId,
    teamName,
    matchId,
    idB,
    teamBId,
    teamNameB
  ) => {
    setLoading(true);
    if (
      scoreTeamA.value === null ||
      scoreTeamA.value === "" ||
      redTeamA.value === null ||
      redTeamA.value === "" ||
      yellowTeamA.value === "" ||
      yellowTeamA.value === ""
    ) {
      toast.error("Không được để trống", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
      return;
    } else if (
      scoreTeamA.value < 0 ||
      redTeamA.value < 0 ||
      yellowTeamA.value < 0
    ) {
      toast.error("Số lớn hơn hoặc bằng 0", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
      return;
    }
    const data = {
      id: id,
      teamScore: scoreTeamA.value,
      yellowCardNumber: yellowTeamA.value,
      redCardNumber: redTeamA.value,
      teamId: teamId,
      matchId: matchId,
      result: "",
      nextTeam: "",
      teamName: teamName,
    };
    try {
      const response = await axios.put(
        "https://afootballleague.ddns.net/api/v1/TeamInMatch",
        data
      );
      if (response.status === 200) {
        await updateTeamB(idB, teamBId, teamNameB, matchId);
      }
    } catch (error) {
      setLoading(false);
      setCheck(!check);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(error);
    }
  };
  const updateTeamB = async (id, teamId, teamName, matchId) => {
    setLoading(true);
    if (
      scoreTeamB.value === null ||
      scoreTeamB.value === "" ||
      redTeamB.value === null ||
      redTeamB.value === "" ||
      yellowTeamB.value === "" ||
      yellowTeamB.value === ""
    ) {
      toast.error("Không được để trống", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
      return;
    } else if (
      scoreTeamB.value < 0 ||
      redTeamB.value < 0 ||
      yellowTeamB.value < 0
    ) {
      toast.error("Số lớn hơn hoặc bằng 0", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
      return;
    }
    const data = {
      id: id,
      teamScore: scoreTeamB.value,
      yellowCardNumber: yellowTeamB.value,
      redCardNumber: redTeamB.value,
      teamId: teamId,
      matchId: matchId,
      teamName: teamName,
    };
    try {
      const response = await axios.put(
        "https://afootballleague.ddns.net/api/v1/TeamInMatch",
        data
      );
      if (response.status === 200) {
        setPopupUpdateMatch(false);
        setLoading(false);
        setCheck(!check);
        toast.success("Cập nhật thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(error);
    }
  };

  const updateMatch = async (
    e,
    matchId,
    teamAId,
    teamBId,
    idA,
    idB,
    teamNameA,
    teamNameB
  ) => {
    e.preventDefault();
    await updateTeamA(
      idA,
      teamAId,
      teamNameA,
      matchId,
      idB,
      teamBId,
      teamNameB
    );
  };

  const validateForm = (name, value) => {
    switch (name) {
      case "scoreTeamA":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Không được để trống",
          };
        } else if (value < 0) {
          return {
            flag: false,
            content: "*Số lớn hơn bằng 0",
          };
        }
        break;
      case "scoreTeamB":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Không được để trống",
          };
        } else if (value < 0) {
          return {
            flag: false,
            content: "*Số lớn hơn bằng 0",
          };
        }
        break;
      case "redTeamA":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Không được để trống",
          };
        } else if (value < 0) {
          return {
            flag: false,
            content: "*Số lớn hơn bằng 0",
          };
        }
        break;
      case "readTeamB":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Không được để trống",
          };
        } else if (value < 0) {
          return {
            flag: false,
            content: "*Số lớn hơn bằng 0",
          };
        }
        break;
      case "yellowTeamA":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Không được để trống",
          };
        } else if (value < 0) {
          return {
            flag: false,
            content: "*Số lớn hơn bằng 0",
          };
        }
        break;
      case "yellowTeamB":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Không được để trống",
          };
        } else if (value < 0) {
          return {
            flag: false,
            content: "*Số lớn hơn bằng 0",
          };
        }
        break;
      default:
        break;
    }

    return { flag: true, content: null };
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    const flagValid = validateForm(name, value);
    switch (name) {
      case "scoreTeamA":
        let scoreTeamA = null;
        if (flagValid.flag === false) {
          scoreTeamA = {
            value,
            error: flagValid.content,
          };
        } else {
          scoreTeamA = {
            value,
            error: null,
          };
        }
        setScoreTeamA({
          ...scoreTeamA,
        });
        break;
      case "scoreTeamB":
        let scoreTeamB = null;
        if (flagValid.flag === false) {
          scoreTeamB = {
            value,
            error: flagValid.content,
          };
        } else {
          scoreTeamB = {
            value,
            error: null,
          };
        }
        setScoreTeamB({
          ...scoreTeamB,
        });
        break;
      case "redTeamA":
        let redTeamA = null;
        if (flagValid.flag === false) {
          redTeamA = {
            value,
            error: flagValid.content,
          };
        } else {
          redTeamA = {
            value,
            error: null,
          };
        }
        setRedTeamA({
          ...redTeamA,
        });
        break;
      case "redTeamB":
        let redTeamB = null;
        if (flagValid.flag === false) {
          redTeamB = {
            value,
            error: flagValid.content,
          };
        } else {
          redTeamB = {
            value,
            error: null,
          };
        }
        setRedTeamB({
          ...redTeamB,
        });
        break;
      case "yellowTeamA":
        let yellowTeamA = null;
        if (flagValid.flag === false) {
          yellowTeamA = {
            value,
            error: flagValid.content,
          };
        } else {
          yellowTeamA = {
            value,
            error: null,
          };
        }
        setYellowTeamA({
          ...yellowTeamA,
        });
        break;
      case "yellowTeamB":
        let yellowTeamB = null;
        if (flagValid.flag === false) {
          yellowTeamB = {
            value,
            error: flagValid.content,
          };
        } else {
          yellowTeamB = {
            value,
            error: null,
          };
        }
        setYellowTeamB({
          ...yellowTeamB,
        });
        break;
      default:
        break;
    }
  };

  const [message, setMessage] = useState([]);
  const [connection, setConnection] = useState();
  const [room, setRoom] = useState("");

  const joinRoom = async (room) => {
    try {
      console.log(user);
      let Id = "0";
      let username = "guest";
      let avatar = "guest";
      let newGuest = true;
      console.log("guest" + guestId);
      if (user) {
        Id = user.userVM.id.toString();
        username = user.userVM.username;
        avatar = user.userVM.avatar;
        newGuest = false;
      }
      if (!user && guestId) {
        Id = guestId.toString();
        newGuest = false;
      }
      // const room = "room2";
      const connectionId = "a";
      console.log(Id);
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7225/chat")
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("ReceiveComment", (user, comment) => {
        setMessage((message) => [...message, { user, comment }]);
      });

      connection.on("Guest", (guestId) => {
        localStorage.setItem("guestId", guestId);
        console.log(guestId);
      });
      await connection.start();
      await connection.invoke("JoinStream", {
        Id,
        username,
        avatar,
        room,
        connectionId,
        newGuest,
      });
      setConnection(connection);
      console.log(connection);
    } catch (err) {
      console.log(err);
    }
  };

  const sendComment = async (c) => {
    try {
      const comment = c;
      await connection.invoke("sendComment", comment);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header />
      {loading ? <LoadingAction /> : null}
      <div
        className={popupUpdateMatch ? `overlay active` : "active"}
        onClick={() => {
          setPopupUpdateMatch(false);
        }}
      ></div>
      {allTeamA != null &&
        allTeamB != null &&
        allTeamA.map((item, index) => (
          <form
            className={
              popupUpdateMatch
                ? `${styles.popup__news} ${styles.active}`
                : styles.popup__news
            }
            onSubmit={(event) => {
              updateMatch(
                event,
                idMatch,
                item.teamId,
                allTeamB[index].teamId,
                item.id,
                allTeamB[index].id,
                item.teamName,
                allTeamB[index].teamName
              );
            }}
          >
            <div
              className={styles.close}
              onClick={() => setPopupUpdateMatch(false)}
            >
              X
            </div>
            <h4>Cập nhật tỉ số</h4>
            <div className={styles.wrapForm}>
              <div className={styles.divFlex}>
                <label id="scoreTeamA">Bàn thắng đội {item.teamName} </label>
                <input
                  type="number"
                  id="scoreTeamA"
                  value={scoreTeamA.value}
                  onChange={onChangeHandler}
                  name="scoreTeamA"
                />
                <p className={styles.lineMin}>-</p>
                <input
                  type="number"
                  id="scoreTeamB"
                  value={scoreTeamB.value}
                  onChange={onChangeHandler}
                  name="scoreTeamB"
                />
                <label id="scoreTeamB">
                  Bàn thắng đội {allTeamB[index].teamName}
                </label>
              </div>
              {/* {scoreTeamA.value > 0 || scoreTeamB.value > 0 ? (
                <div className={styles.divFlex}>
                  <label id="scoreTeamA">Bàn thắng đội {item.teamName} </label>
                  <select>
                    <option value={""}></option>
                    {playerRegisterA !== null &&
                      playerRegisterA.map((item) => (
                        <option>{item.footballPlayer.playerName}</option>
                      ))}
                  </select>
                  <p className={styles.lineMin}>-</p>
                  <select>
                    <option value={""}></option>
                    {playerRegisterB !== null &&
                      playerRegisterB.map((item) => (
                        <option>{item.footballPlayer.playerName}</option>
                      ))}
                  </select>
                  <label id="scoreTeamB">
                    Bàn thắng đội {allTeamB[index].teamName}
                  </label>
                </div>
              ) : null} */}
              <div className={styles.divFlex}>
                <label id="redTeamA">Thẻ đỏ đội {item.teamName} </label>
                <input
                  type="number"
                  id="redTeamA"
                  value={redTeamA.value}
                  onChange={onChangeHandler}
                  name="redTeamA"
                />
                <p className={styles.lineMin}>-</p>
                <input
                  type="number"
                  id="redTeamB"
                  value={redTeamB.value}
                  onChange={onChangeHandler}
                  name="redTeamB"
                />
                <label id="redTeamB">
                  Thẻ đỏ đội {allTeamB[index].teamName}
                </label>
              </div>
              <div className={styles.divFlex}>
                <label id="yellowTeamA">Thẻ vàng đội {item.teamName} </label>
                <input
                  type="number"
                  id="yellowTeamA"
                  value={yellowTeamA.value}
                  onChange={onChangeHandler}
                  name="yellowTeamA"
                />
                <p className={styles.lineMin}>-</p>
                <input
                  type="number"
                  id="yellowTeamB"
                  value={yellowTeamB.value}
                  onChange={onChangeHandler}
                  name="yellowTeamB"
                />
                <label id="yellowTeamB">
                  Thẻ vàng đội {allTeamB[index].teamName}
                </label>
              </div>
            </div>
            <button>Cập nhật</button>
          </form>
        ))}
      <div className={styles.match}>
        <Link to={`/findTournaments`} replace className={styles.linkBack}>
          Các giải đấu
        </Link>
        <span className={styles.sw}>{`>>`}</span>
        <Link
          to={`/tournamentDetail/${tournamentID}/scheduleTournamentDetail`}
          className={styles.linkBack}
        >
          Lịch thi đấu
        </Link>
        <span className={styles.sw}>{`>>`}</span>
        <Link to={`/match/${idMatch}/matchDetail`} className={styles.linkBack}>
          Trận đấu
        </Link>
        {allTeamA != null && allTeamB != null ? (
          <>
            <h2 className={styles.title}>Trận đấu</h2>
            <div className={styles.action}>
              {/* {user !== null &&
              location.state !== null &&
              user.userVM.id === location.state.hostTournamentId ? ( */}
              <p
                className={styles.updateMatch}
                onClick={() =>
                  navigate(`/detailMatch/${idMatch}`, {
                    state: {
                      tourDetail: location.state.tourDetail,
                    },
                  })
                }
              >
                Cập nhật tỉ số
              </p>
              {/* ) : null} */}
            </div>
            <div className={styles.match__header}>
              {allTeamA.map((item, index) => (
                <div className={styles.sub__header}>
                  <div className={styles.header__text}>
                    <div className={styles.header__name}>
                      {item.match.fight}
                    </div>
                    <p className={styles.header__day}>
                      {formatDateTime(item.match.matchDate)}
                    </p>
                  </div>
                  <div className={styles.header__status}>
                    {getStatusMatch(item.match.status)}
                  </div>
                </div>
              ))}
              {allTeamA.map((item, index) => (
                <div className={styles.match__team}>
                  <div className={styles.logo}>
                    <img
                      src={item.teamInTournament.team.teamAvatar}
                      alt={item.teamName}
                    />
                    <h2>{item.teamName}</h2>
                  </div>
                  <div className={styles.score__A}>{item.teamScore}</div>
                  <div className={styles.line}>-</div>
                  <div className={styles.score__B}>
                    {allTeamB[index].teamScore}
                  </div>
                  <div className={styles.logo}>
                    <img
                      src={allTeamB[index].teamInTournament.team.teamAvatar}
                      alt={allTeamB[index].teamName}
                    />
                    <h2>{allTeamB[index].teamName}</h2>
                  </div>
                </div>
              ))}
              <div className={styles.player__score}>
                <div className={styles.player__A}>
                  <p>
                    Peter Pan
                    <span>33'</span>
                    <span>65'</span>
                  </p>
                  <p>
                    Tommy Tèo
                    <span>33'</span>
                  </p>
                  <p>
                    Thay giao ba
                    <span>33'</span>
                  </p>
                </div>
                <div className={styles.logo__ball}>
                  <img src="/assets/icons/soccer-ball-retina.png" alt="ball" />
                </div>
                <div className={styles.player__B}>
                  <p>
                    Chipu
                    <span>33'</span>
                    <span>65'</span>
                  </p>
                  <p>
                    Tommy Tèo
                    <span>33'</span>
                  </p>
                  <p>
                    Thay giao ba
                    <span>33'</span>
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.match__menu}>
              <Link
                to={`/match/${idMatch}/matchDetail`}
                className={
                  activeTeamDetail === `/match/${idMatch}/matchDetail`
                    ? styles.active
                    : ""
                }
                onClick={() =>
                  setActiveTeamDetail(`/match/${idMatch}/matchDetail`)
                }
              >
                Thống kê
              </Link>
              <Link
                to={`/match/${idMatch}/livestream`}
                className={
                  activeTeamDetail === `/match/${idMatch}/livestream`
                    ? styles.active
                    : ""
                }
                onClick={() =>
                  setActiveTeamDetail(`/match/${idMatch}/livestream`)
                }
              >
                Livestream
              </Link>
            </div>
            {renderByLink()}
          </>
        ) : (
          <p className={styles.error}>Trận đấu này không tồn tại</p>
        )}
      </div>
      {/* <form action="">
        <input type="text" value={room} onChange={(e) => {

          setRoom(e.target.value);
        }} />
        <button onClick={(e) =>{e.preventDefault(); joinRoom(room);}}>join</button>
      </form> */}
      <Footer />
    </>
  );
}

export default Match;
