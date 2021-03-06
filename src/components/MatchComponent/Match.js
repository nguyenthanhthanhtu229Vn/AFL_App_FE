import axios from "axios";
import { data } from "flickity";
import React, { useEffect, useState, useRef } from "react";
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
import { getAllPlayerInTournamentByTeamInTournamentIdAPI } from "../../api/PlayerInTournamentAPI";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { getMatchDetailByMatchIdAPI } from "../../api/MatchDetailAPI";
import { saveRecordInMatchDetail } from "../../api/MatchDetailAPI";

function Match() {
  const location = useLocation();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );

  const [guestId, setGuestId] = useState(localStorage.getItem("guestId"));
  const inputRef = useRef(null);
  // location.state.hostTournamentId
  useEffect(() => {
    joinRoom();
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
  const [playerPopup, setPlayerPopup] = useState(false);
  const [playerCardPopup, setPlayerCardPopup] = useState(false);
  const [playerPopupB, setPlayerPopupB] = useState(false);
  const [playerCardPopupB, setPlayerCardPopupB] = useState(false);
  const [card, setCard] = useState("");
  const [popupUpdateMatch, setPopupUpdateMatch] = useState(false);
  // update Player
  const [playerScoreA, setplayerScoreA] = useState([]);
  const [playerScoreB, setPlayerScoreB] = useState([]);

  const [playerTeamA, setPlayerTeamA] = useState([]);
  const [playerTeamB, setPlayerTeamB] = useState([]);
  //
  const [scoreTeamA, setScoreTeamA] = useState({ value: 0, error: "" });
  const [scoreTeamB, setScoreTeamB] = useState({ value: 0, error: "" });
  const [redTeamA, setRedTeamA] = useState({ value: 0, error: "" });
  const [redTeamB, setRedTeamB] = useState({ value: 0, error: "" });
  const [yellowTeamA, setYellowTeamA] = useState({ value: 0, error: "" });
  const [yellowTeamB, setYellowTeamB] = useState({ value: 0, error: "" });
  const [detailTeamA, setDetailTeamA] = useState(null);
  const [detailTeamB, setDetailTeamB] = useState(null);
  const getMatch = () => {
    setLoading(true);
    let afterURL = `TeamInMatch/matchId?matchId=${idMatch}`;
    let response = getAPI(afterURL);
    response
      .then((res) => {
        const allMatch = res.data.teamsInMatch;

        // if (allMatch[0].teamScore > 0 || allMatch[1].teamScore > 0) {
        //   getDataMatchDetail(allMatch[0].matchId, allMatch[0], allMatch[1]);
        // }
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
        setRedTeamA({ value: res.data.teamsInMatch[0].redCardNumber });
        setRedTeamB({ value: res.data.teamsInMatch[1].redCardNumber });
        setYellowTeamA({ value: res.data.teamsInMatch[0].yellowCardNumber });
        setYellowTeamB({ value: res.data.teamsInMatch[1].yellowCardNumber });
        setTournamentID(res.data.teamsInMatch[0].match.tournamentId);
        setTokenLivestream(res.data.teamsInMatch[0].match.tokenLivestream);
        getTourDetail(res.data.teamsInMatch[0].match.tournamentId);

        getPlayer(res.data.teamsInMatch[0].teamInTournament.id, "teamA");
        getPlayer(res.data.teamsInMatch[1].teamInTournament.id, "teamB");
        getMatchDetail();

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

  const [detail, setDetail] = useState([]);
  const getMatchDetail = (data, team) => {
    setLoading(true);
    let response = getMatchDetailByMatchIdAPI(idMatch);
    response
      .then((res) => {
        devidePlayer(res.data.matchDetails, data, team);
        // setDetail(res.data.matchDetails);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const devidePlayer = (data, player, team) => {
    const playerScoreA = [];
    for (let item of data) {
      if (playerScoreA.length > 0) {
        const index = playerScoreA.findIndex(
          (itemIn) =>
            itemIn.idPlayer === item.footballPlayer.id &&
            itemIn.actionMatchId === item.actionMatchId
        );
        if (index === -1) {
          let playerSide = "teamB";
          const playerIndex = player.findIndex(
            (itemP) =>
              itemP.playerInTeam.footballPlayerId === item.footballPlayer.id
          );
          if (playerIndex >= 0) {
            playerSide = "teamA";
          }

          playerScoreA.push({
            idPlayer: item.footballPlayer.id,
            namePlayer: item.footballPlayer.playerName,
            playerAvatar: item.footballPlayer.playerAvatar,
            actionMatchId: item.actionMatchId,
            minutesScore: [item.actionMinute],
            playerSide: playerSide,
          });
        } else {
          playerScoreA[index].minutesScore.push(item.actionMinute);
        }
      } else {
        let playerSide = "teamB";
        const playerIndex = player.findIndex(
          (itemP) =>
            itemP.playerInTeam.footballPlayerId === item.footballPlayer.id
        );
        if (playerIndex >= 0) {
          playerSide = "teamA";
        }
        playerScoreA.push({
          idPlayer: item.footballPlayer.id,
          namePlayer: item.footballPlayer.playerName,
          playerAvatar: item.footballPlayer.playerAvatar,
          teamId: item.teamId,
          actionMatchId: item.actionMatchId,
          minutesScore: [item.actionMinute],
          playerSide: playerSide,
        });
      }
    }
    playerScoreA.sort(function (a, b) {
      return a.actionMatchId - b.actionMatchId;
    });
    setDetail(playerScoreA);
  };

  const getDataMatchDetail = (data, teamA, teamB) => {
    const response = getMatchDetailByMatchIdAPI(data);
    response
      .then((res) => {
        const matchDetail = res.data.matchDetails;
        devidedPlayerScore(matchDetail, teamA, teamB);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const devidedPlayerScore = (data, teamA, teamB) => {
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
              itemIn.idPlayerInTournament === item.playerInTournament.id &&
              itemIn.actionMatchId === item.actionMatchId
          );
          if (index === -1) {
            playerScoreA.push({
              idPlayerInTournament: item.playerInTournament.id,
              namePlayer:
                item.playerInTournament.playerInTeam.footballPlayer.playerName,
              actionMatchId: item.actionMatchId,
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
            actionMatchId: item.actionMatchId,
            minutesScore: [item.actionMinute],
          });
        }
      }
    }
    playerScoreA.sort(function (a, b) {
      return a.actionMatchId - b.actionMatchId;
    });
    setDetailTeamA(playerScoreA);

    const playerScoreB = [];
    for (let item of data) {
      if (item.playerInTournament.playerInTeam.teamId === idteamB) {
        if (playerScoreB.length > 0) {
          const index = playerScoreB.findIndex(
            (itemIn) =>
              itemIn.idPlayerInTournament === item.playerInTournament.id &&
              itemIn.actionMatchId === item.actionMatchId
          );
          if (index === -1) {
            playerScoreB.push({
              idPlayerInTournament: item.playerInTournament.id,
              namePlayer:
                item.playerInTournament.playerInTeam.footballPlayer.playerName,
              actionMatchId: item.actionMatchId,
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
            actionMatchId: item.actionMatchId,
            minutesScore: [item.actionMinute],
          });
        }
      }
    }
    playerScoreB.sort(function (a, b) {
      return a.actionMatchId - b.actionMatchId;
    });
    setDetailTeamB(playerScoreB);
  };

  console.log(detailTeamA);
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
  //   // S????a API lai jum
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
  //   // S????a API lai jum
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
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  console.log(playerTeamA);

  const [players, setPlayers] = useState([]);
  const getPlayer = (id, team) => {
    let response = getAllPlayerInTournamentByTeamInTournamentIdAPI(id);
    response.then((res) => {
      if (team == "teamA") {
        getMatchDetail(res.data.playerInTournaments);
        setPlayerTeamA(res.data);
      } else {
        setPlayerTeamB(res.data);
      }
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
          scoreA={scoreA}
          scoreB={scoreB}
          redA={redA}
          redB={redB}
          yellowA={yellowA}
          yellowB={yellowB}
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
      return <p style={{ fontStyle: "italic" }}>Ch??a di????n ra</p>;
    } else if (matchStatus === "Start") {
      return <p style={{ color: "green" }}>??a?? di????n ra</p>;
    } else {
      return <p style={{ color: "red" }}>??a?? k????t thu??c</p>;
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
      toast.error("Kh??ng ????????c ?????? tr????ng", {
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
      toast.error("S???? l????n h??n ho????c b????ng 0", {
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
      toast.error("Kh??ng ????????c ?????? tr????ng", {
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
      toast.error("S???? l????n h??n ho????c b????ng 0", {
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
        toast.success("C????p nh????t tha??nh c??ng", {
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
            content: "*Kh??ng ???????c ????? tr???ng",
          };
        } else if (value < 0) {
          return {
            flag: false,
            content: "*S???? l????n h??n b????ng 0",
          };
        }
        break;
      case "scoreTeamB":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Kh??ng ???????c ????? tr???ng",
          };
        } else if (value < 0) {
          return {
            flag: false,
            content: "*S???? l????n h??n b????ng 0",
          };
        }
        break;
      case "redTeamA":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Kh??ng ???????c ????? tr???ng",
          };
        } else if (value < 0) {
          return {
            flag: false,
            content: "*S???? l????n h??n b????ng 0",
          };
        }
        break;
      case "readTeamB":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Kh??ng ???????c ????? tr???ng",
          };
        } else if (value < 0) {
          return {
            flag: false,
            content: "*S???? l????n h??n b????ng 0",
          };
        }
        break;
      case "yellowTeamA":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Kh??ng ???????c ????? tr???ng",
          };
        } else if (value < 0) {
          return {
            flag: false,
            content: "*S???? l????n h??n b????ng 0",
          };
        }
        break;
      case "yellowTeamB":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Kh??ng ???????c ????? tr???ng",
          };
        } else if (value < 0) {
          return {
            flag: false,
            content: "*S???? l????n h??n b????ng 0",
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
  const [team, setTeam] = useState();
  const [mDetail, setMDetail] = useState();
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [redA, setRedA] = useState(0);
  const [redB, setRedB] = useState(0);
  const [yellowA, setYellowA] = useState(0);
  const [yellowB, setYellowB] = useState(0);
  const [message, setMessage] = useState([]);
  const [connection, setConnection] = useState();

  const [room, setRoom] = useState("");
  const joinRoom = async () => {
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
      const room = idMatch;
      const connectionId = "a";
      console.log(Id);
      const connection = new HubConnectionBuilder()

        .withUrl("https://afootballleague.ddns.net/chat")
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("ReceiveComment", (user, comment) => {
        setMessage((message) => [...message, { user, comment }]);
      });

      connection.on("MatchDetail", (mDt) => {
        console.log(mDt);
        setMDetail(mDt);
        // setDetail(detail =>[...detail,mDt]);
      });

      connection.on("TeamInMatch", (tim) => {
        console.log(tim.teamScore);
        setTeam(tim);
        if (tim && allTeamA != null && tim.id === allTeamA[0].id) {
          setRedA(tim.redCardNumber);
          setYellowA(tim.yellowCardNumber);
          setScoreA(tim.teamScore);
        }
        if (tim && allTeamB && tim.id === allTeamB[0].id) {
          setRedB(tim.redCardNumber);
          setYellowB(tim.yellowCardNumber);
          setScoreB(tim.teamScore);
        }
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

  useEffect(() => {
    if (
      team &&
      mDetail &&
      detail &&
      allTeamA != null &&
      team.id === allTeamA[0].id
    ) {
      setRedA(team.redCardNumber);
      setYellowA(team.yellowCardNumber);
      setScoreA(team.teamScore);
    }
    if (team && mDetail && allTeamB != null && team.id === allTeamB[0].id) {
      setRedB(team.redCardNumber);
      setYellowB(team.yellowCardNumber);
      setScoreB(team.teamScore);
    }

    if (mDetail && detail && playerTeamA) {
      const index = detail.findIndex(
        (itemIn) =>
          itemIn.idPlayer === mDetail.footballPlayer.id &&
          itemIn.actionMatchId === mDetail.actionMatchId
      );
      if (index === -1) {
        let playerSide = "teamB";
        const playerIndex = playerTeamA.playerInTournaments.findIndex(
          (itemP) =>
            itemP.playerInTeam.footballPlayerId === mDetail.footballPlayer.id
        );
        if (playerIndex >= 0) {
          playerSide = "teamA";
        }
        const data = {
          idPlayer: mDetail.footballPlayer.id,
          namePlayer: mDetail.footballPlayer.playerName,
          playerAvatar: mDetail.footballPlayer.playerAvatar,
          actionMatchId: mDetail.actionMatchId,
          minutesScore: [mDetail.actionMinute],
          playerSide: playerSide,
        };
        let sortList = [...detail, data];
        sortList.sort(function (a, b) {
          return a.actionMatchId - b.actionMatchId;
        });

        setDetail(sortList);
        console.log("a");
      } else {
        let minutesScore = [...detail[index].minutesScore];
        minutesScore.push(mDetail.actionMinute);
        setDetail((detail) => [
          ...detail,
          (detail[index].minutesScore = minutesScore),
        ]);
      }
    }
  }, [team]);

  const sendComment = async (c) => {
    try {
      const comment = c;
      await connection.invoke("sendComment", comment);
    } catch (err) {
      console.log(err);
    }
  };

  // const [minutes, setMinutes] = useState("");
  const [minuteIndex, setMinuteIndex] = useState();
  const [minutesError, setMinutesError] = useState();

  const createMatchDetail = async (
    playerId,
    playerInTournamentId,
    actionId,
    minutes
  ) => {
    console.log(playerInTournamentId + "acmcm" + minuteIndex + cardIndex);
    if (card == "yellow") {
      if (cardIndex != minuteIndex) {
        return;
      }
      actionId = 2;
    }
    if (card == "red") {
      if (cardIndex != minuteIndex) {
        return;
      }
      actionId = 3;
    }
    const data = {
      actionMatchId: actionId,
      actionMinute: `${minutes}`,
      matchId: idMatch,
      playerInTournamentId: playerInTournamentId,
      footballPlayerId: playerId,
    };

    if (playerInTournamentId == minuteIndex) {
      if (minutes == "" || minutes == undefined || minutes == null) {
        setMinutesError("Vui l??ng nh???p s??? ph??t ...");
        return;
      }
      let response = saveRecordInMatchDetail(data, idMatch);
      response
        .then((res) => {
          updateTeamInMatch(actionId);
          console.log(res.data);
          if (playerPopup) {
            setPlayerPopup(false);
          } else {
            setPlayerPopupB(false);
          }
          if (playerCardPopup) {
            setPlayerCardPopup(false);
          } else {
            setPlayerCardPopupB(false);
          }
          setMinuteIndex(0);
          // setMinutes("");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const updateTeamInMatch = async (actionId) => {
    try {
      let tim = {};
      let teamScore = 0;
      let yellowCardNumber = 0;
      let redCardNumber = 0;
      if (playerPopup || playerCardPopup) {
        tim = allTeamA[0];
        teamScore = tim.teamScore;
        if (scoreA > 0) {
          teamScore = scoreA;
        }
        yellowCardNumber = tim.yellowCardNumber;
        if (yellowA > 0) {
          yellowCardNumber = yellowA;
        }

        redCardNumber = tim.redCardNumber;
        if (redA > 0) {
          yellowCardNumber = redA;
        }
      }
      if (playerPopupB || playerCardPopupB) {
        tim = allTeamB[0];
        teamScore = tim.teamScore;
        if (scoreB > 0) {
          teamScore = scoreB;
        }
        yellowCardNumber = tim.yellowCardNumber;
        if (yellowB > 0) {
          yellowCardNumber = yellowB;
        }

        redCardNumber = tim.redCardNumber;
        if (redB > 0) {
          yellowCardNumber = redB;
        }
      }

      if (actionId == 1) {
        teamScore = teamScore + 1;
      }
      if (card == "yellow") {
        yellowCardNumber = yellowCardNumber + 1;
      }
      if (card == "red") {
        redCardNumber = redCardNumber + 1;
      }
      const data = {
        id: tim.id,
        teamScore: teamScore,
        teamScoreLose: tim.teamScoreLose,
        yellowCardNumber: yellowCardNumber,
        redCardNumber: redCardNumber,
        teamInTournamentId: tim.teamInTournamentId,
        matchId: tim.matchId,
        result: tim.result,
        nextTeam: tim.nextTeam,
        teamName: tim.teamName,
      };
      const response = await axios.put(
        `https://afootballleague.ddns.net/api/v1/TeamInMatch?room=${idMatch}`,
        data
      );
      await calculateScore();
    } catch (err) {
      console.log(err);
    }
  };

  const calculateScore = async () => {
    try {
      let idTour = allTeamA[0].teamInTournament.tournamentId;
      const response = await axios.put(
        `https://afootballleague.ddns.net/api/v1/team-in-tournaments/update-score?tournamentId=${idTour}`
      );
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const PopupPlayer = (players) => {
    const [minutes, setMinutes] = useState();
    return (
      <div className={styles.popUpPlayerWrap}>
        <div className={styles.playerPopup}>
          <div>
            <h2>Ch???n c???u th??? ghi b??n </h2>
            <span
              className={styles.close}
              onClick={() => {
                if (playerPopup) {
                  setPlayerPopup(false);
                } else {
                  setPlayerPopupB(false);
                }
                setMinuteIndex(0);
                setMinutes("");
              }}
            >
              X
            </span>
          </div>

          {players &&
            players.players.playerInTournaments.map((item) => (
              <div className={styles.playerWrap}>
                <img
                  src={item.playerInTeam.footballPlayer.playerAvatar}
                  alt=""
                />
                <span className={styles.playerName}>
                  {item.playerInTeam.footballPlayer.playerName}
                </span>
                {minuteIndex == item.id && (
                  <div className={styles.minutes}>
                    {/* <p>S??? ph??t ghi b??n</p> */}
                    <input
                      type="number"
                      placeholder="S??? ph??t ghi b??n"
                      onChange={(e) => {
                        setMinutes(e.target.value);
                      }}
                      value={minutes}
                      onFocus={(e) => {
                        setMinutesError("");
                      }}
                    />
                    <p className="error">{minutesError}</p>
                  </div>
                )}
                <span
                  className={styles.choose}
                  onClick={() => {
                    setMinuteIndex(item.id);
                    createMatchDetail(
                      item.playerInTeam.footballPlayerId,
                      item.id,
                      1,
                      minutes
                    );
                    setMinutes("");
                  }}
                >
                  {minuteIndex == item.id ? "Ho??n t???t" : "Ch???n"}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  };
  const [cardIndex, setCardIndex] = useState(0);
  const PopupPlayerCard = (players, team) => {
    const [minutes, setMinutes] = useState();
    return (
      <div className={styles.popUpPlayerWrap}>
        <div className={styles.playerPopup}>
          <div>
            <h2>Ch???n c???u th??? ph???m l???i </h2>
            <span
              className={styles.close}
              onClick={() => {
                if (playerCardPopup) {
                  setPlayerCardPopup(false);
                } else {
                  setPlayerCardPopupB(false);
                }
                setMinuteIndex(0);
                setMinutes("");
                setCardIndex(0);
                setCard("");
              }}
            >
              X
            </span>
          </div>

          {players &&
            players.players.playerInTournaments.map((item) => (
              <div className={styles.playerWrap}>
                <img
                  src={item.playerInTeam.footballPlayer.playerAvatar}
                  alt=""
                />
                <span className={styles.playerName}>
                  {item.playerInTeam.footballPlayer.playerName}
                </span>
                <div className={styles.card}>
                  <div
                    className={`${styles.yellow} ${
                      cardIndex == item.id &&
                      cardIndex == minuteIndex &&
                      card == "yellow" &&
                      styles.active
                    }`}
                    onClick={() => {
                      setCard("yellow");
                      setCardIndex(item.id);
                    }}
                  ></div>
                  <div
                    className={`${styles.red} ${
                      cardIndex == item.id &&
                      cardIndex == minuteIndex &&
                      card == "red" &&
                      styles.active
                    }`}
                    onClick={() => {
                      setCard("red");
                      setCardIndex(item.id);
                    }}
                  ></div>
                </div>
                {minuteIndex == item.id && (
                  <div className={styles.minutes}>
                    {/* <p>S??? ph??t ghi b??n</p> */}
                    <input
                      type="number"
                      placeholder="Nh???p s??? ph??t "
                      value={minutes}
                      onChange={(e) => {
                        setMinutes(e.target.value);
                      }}
                      onFocus={(e) => {
                        setMinutesError("");
                      }}
                    />
                    <p className="error">{minutesError}</p>
                  </div>
                )}
                <span
                  className={styles.choose}
                  onClick={() => {
                    setMinuteIndex(item.id);
                    createMatchDetail(
                      item.playerInTeam.footballPlayerId,
                      item.id,
                      1,
                      minutes
                    );
                    setMinutes("");
                  }}
                >
                  {minuteIndex == item.id ? "Ho??n t???t" : "Ch???n"}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  };
  console.log(minuteIndex);
  useEffect(() => {
    console.log(scoreA);
  }, [playerPopup]);

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
            <h4>C????p nh????t ti?? s????</h4>
            <div className={styles.wrapForm}>
              <div className={styles.divFlex}>
                <label id="scoreTeamA">Ba??n th????ng ??????i {item.teamName} </label>
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
                  Ba??n th????ng ??????i {allTeamB[index].teamName}
                </label>
              </div>
              {/* {scoreTeamA.value > 0 || scoreTeamB.value > 0 ? (
                <div className={styles.divFlex}>
                  <label id="scoreTeamA">Ba??n th????ng ??????i {item.teamName} </label>
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
                    Ba??n th????ng ??????i {allTeamB[index].teamName}
                  </label>
                </div>
              ) : null} */}
              <div className={styles.divFlex}>
                <label id="redTeamA">The?? ??o?? ??????i {item.teamName} </label>
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
                  The?? ??o?? ??????i {allTeamB[index].teamName}
                </label>
              </div>
              <div className={styles.divFlex}>
                <label id="yellowTeamA">The?? va??ng ??????i {item.teamName} </label>
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
                  The?? va??ng ??????i {allTeamB[index].teamName}
                </label>
              </div>
            </div>
            <button>C????p nh????t</button>
          </form>
        ))}
      <div className={styles.match}>
        <Link to={`/findTournaments`} replace className={styles.linkBack}>
          Ca??c gia??i ??????u
        </Link>
        <span className={styles.sw}>{`>>`}</span>
        <Link
          to={`/tournamentDetail/${tournamentID}/scheduleTournamentDetail`}
          className={styles.linkBack}
        >
          Li??ch thi ??????u
        </Link>
        <span className={styles.sw}>{`>>`}</span>
        <Link to={`/match/${idMatch}/matchDetail`} className={styles.linkBack}>
          Tr????n ??????u
        </Link>
        {allTeamA != null && allTeamB != null ? (
          <>
            <h2 className={styles.title}>Tr????n ??????u</h2>
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
                C????p nh????t ti?? s????
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
                  {playerPopup && (
                    <PopupPlayer players={playerTeamA} team="teamA" />
                  )}
                  {playerCardPopup && (
                    <PopupPlayerCard players={playerTeamA} team="teamA" />
                  )}
                  {playerPopupB && (
                    <PopupPlayer players={playerTeamB} team="teamB" />
                  )}
                  {playerCardPopupB && (
                    <PopupPlayerCard players={playerTeamB} team="teamB" />
                  )}
                  <div className={styles.logo}>
                    <img
                      src={item.teamInTournament.team.teamAvatar}
                      alt={item.teamName}
                    />
                    <h2>{item.teamName}</h2>
                    <div className={styles.editWrap}>
                      <button
                        className={styles.editScore}
                        onClick={() => {
                          setPlayerPopup(true);
                        }}
                      >
                        Ghi b??n
                      </button>
                      <button
                        className={styles.editCard}
                        onClick={() => {
                          setPlayerCardPopup(true);
                        }}
                      >
                        Th??? ph???t
                      </button>
                    </div>
                  </div>
                  <div className={styles.score__A}>
                    {scoreA == 0 ? item.teamScore : scoreA}
                  </div>
                  <div className={styles.line}>-</div>
                  <div className={styles.score__B}>
                    {scoreB == 0 ? allTeamB[index].teamScore : scoreB}
                  </div>
                  <div className={styles.logo}>
                    <img
                      src={allTeamB[index].teamInTournament.team.teamAvatar}
                      alt={allTeamB[index].teamName}
                    />
                    <h2>{allTeamB[index].teamName}</h2>
                    <div className={styles.editWrap}>
                      <button
                        className={styles.editScore}
                        onClick={() => {
                          setPlayerPopupB(true);
                        }}
                      >
                        Ghi b??n
                      </button>
                      <button
                        className={styles.editCard}
                        onClick={() => {
                          setPlayerCardPopupB(true);
                        }}
                      >
                        Th??? ph???t
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className={styles.player__score}>
                <div className={styles.player__A}>
                  {detail &&
                    allTeamA &&
                    detail.map((item) => (
                      <>
                        {item.playerSide == "teamA" && (
                          <div className={styles.playerAction}>
                            <div className={styles.player}>
                              <img
                                style={{
                                  width: 30,
                                  marginRight: 10,
                                }}
                                src={
                                  item.actionMatchId === 1
                                    ? "/assets/icons/soccer-ball-retina.png"
                                    : item.actionMatchId === 2
                                    ? "/assets/icons/yellow-card.png"
                                    : "/assets/icons/red-card.png"
                                }
                                alt="ball"
                              />
                              <p>{item.namePlayer}</p>
                            </div>

                            {item.minutesScore.map((itemMin, indexMin) => {
                              return <span key={indexMin}>{itemMin}'</span>;
                            })}
                          </div>
                        )}
                      </>
                    ))}
                </div>
                <div className={styles.logo__ball}>
                  <img src="/assets/icons/soccer-ball-retina.png" alt="ball" />
                </div>
                <div className={styles.player__B}>
                  {detail &&
                    allTeamB &&
                    detail.map((item) => (
                      <>
                        {item.playerSide == "teamB" && (
                          <div className={styles.playerAction}>
                            <div className={styles.player}>
                              <img
                                style={{
                                  width: 30,
                                  marginRight: 10,
                                }}
                                src={
                                  item.actionMatchId === 1
                                    ? "/assets/icons/soccer-ball-retina.png"
                                    : item.actionMatchId === 2
                                    ? "/assets/icons/yellow-card.png"
                                    : "/assets/icons/red-card.png"
                                }
                                alt="ball"
                              />
                              <p>{item.namePlayer}</p>
                            </div>

                            {item.minutesScore.map((itemMin, indexMin) => {
                              return <span key={indexMin}>{itemMin}'</span>;
                            })}
                          </div>
                        )}
                      </>
                    ))}
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
                Th????ng k??
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
          <p className={styles.error}>Tr????n ??????u na??y kh??ng t????n ta??i</p>
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
