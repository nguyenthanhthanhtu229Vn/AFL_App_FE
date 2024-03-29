import React, { useState, useEffect } from "react";
import styles from "./style/style.module.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { useParams, useLocation, Link } from "react-router-dom";
import LoadingAction from "../LoadingComponent/LoadingAction";
import {
  getTeamInMatchByMatchIdAPI,
  updateTeamInMatch,
} from "../../api/TeamInMatchAPI";
import DetailInMatch from "./DetailInMatch";
import { getAllPlayerInTournamentByTeamInTournamentIdAPI } from "../../api/PlayerInTournamentAPI";
import { getPlayerInTeamByIdAPI } from "../../api/PlayerInTeamAPI";
import {
  getMatchDetailByMatchIdAPI,
  saveRecordInMatchDetail,
  deleteMatchDetailByTypeAPI,
} from "../../api/MatchDetailAPI";
import {
  updateScoreInTournamentByTourIdAPI,
  getTeamByPlayerIdAPI,
} from "../../api/TeamInTournamentAPI";
import { toast } from "react-toastify";
import { async } from "@firebase/util";
import { putStatusScorePrediction } from "../../api/ScorePrediction";
import { postTournamentResult } from "../../api/TournamentResultAPI";
import { createTieBreakAPI } from "../../api/MatchAPI";
import { updateNextTeamInRoundAPI } from "../../api/TeamInMatchAPI";
export default function DetailMatch(props) {
  const { idMatch } = useParams();

  const location = useLocation();
  const tourDetail = location.state.tourDetail;
  const hostTournamentId = location.state.hostTournamentId;
  const indexMatch = location.state.indexMatch;
  const title = location.state.title;
  const index = location.state.index;
  const lastMatch = location.state.lastMatch;
  const [teamA, setTeamA] = useState(null);
  const [teamB, setTeamB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scoreA, setScoreA] = useState(null);
  const [scoreB, setScoreB] = useState(null);
  const [yellowA, setYellowA] = useState(null);
  const [yellowB, setYellowB] = useState(null);
  const [redA, setRedA] = useState(null);
  const [redB, setRedB] = useState(null);
  const [hideShow, setHideShow] = useState(false);
  const [typeDetail, setTypeDetail] = useState(null);
  const [matchDetail, setMatchDetail] = useState(null);
  // const [stateScore, setStateScore] = useState(false);
  // const [stateYellow, setStateYellow] = useState(false);
  // const [stateRed, setStateRed] = useState(false);
  const [playerA, setPlayerA] = useState(null);
  const [playerB, setPlayerB] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState(false);
  
  useEffect(() => {
    getTeamInMatchByMatchID();
  }, [statusUpdate === true]);
  useEffect(() => {
    if (teamA !== null && teamB !== null) {
      setAllInfor();
    }
  }, [teamA !== null && teamB !== null]);
  const checkPlayerInTeam = async (idTeam, idPlayer, idTeamB) => {
    try {
      const response = await getTeamByPlayerIdAPI(idTeam, idPlayer);
      if (response.status === 200) {
        if (response.data.countList > 0) {
          return idTeam;
        } else {
          return idTeamB;
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  const getMatchDetailInFor = async (idteamA, idTeamB) => {
    try {
      const response = await getMatchDetailByMatchIdAPI(idMatch);
      if (response.status === 200) {
        setLoading(false);
        const data = response.data.matchDetails;
        if (data.length > 0) {
          for (const item of data) {
            const teamId = await checkPlayerInTeam(
              idteamA,
              item.footballPlayer.id,
              idTeamB
            );
            item.teamId = teamId;
          }
          setMatchDetail(data);
        }
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };
  const updateScoreInMatch = async (data, type, teamWinPenalty, title) => {
    const newTeamA = teamA;
    const newTeamB = teamB;

    if (type === 1) {
      if (title === null || title.includes("tie-break") === false) {
        console.log(title);
        newTeamA.teamScore = +scoreA;
        newTeamA.teamScoreLose = +scoreB;
        newTeamB.teamScore = +scoreB;
        newTeamB.teamScoreLose = +scoreA;
        if (teamWinPenalty === null) {
          newTeamA.result =
            +scoreA > +scoreB ? "3" : +scoreA === +scoreB ? "1" : "0";
          newTeamB.result =
            +scoreB > +scoreA ? "3" : +scoreA === +scoreB ? "1" : "0";
          newTeamA.scorePenalty = null;
          newTeamB.scorePenalty = null;
        } else {
          const splitResultPenalty = teamWinPenalty.split("-");
          newTeamA.result =
            newTeamA.teamInTournament.team.id == splitResultPenalty[1]
              ? "3"
              : "0";
          newTeamB.result =
            newTeamB.teamInTournament.team.id == splitResultPenalty[1]
              ? "3"
              : "0";
          newTeamA.scorePenalty =
            newTeamA.teamInTournament.team.id == splitResultPenalty[1]
              ? +splitResultPenalty[0]
              : +splitResultPenalty[2];
          newTeamB.scorePenalty =
            newTeamB.teamInTournament.team.id == splitResultPenalty[1]
              ? +splitResultPenalty[0]
              : +splitResultPenalty[2];
        }
      } else {
        newTeamA.scoreTieBreak = +scoreA;
        newTeamB.scoreTieBreak = +scoreB;

        if (teamWinPenalty !== null) {
          const splitResultPenalty = teamWinPenalty.split("-");
          newTeamA.winTieBreak =
            newTeamA.teamInTournament.team.id == splitResultPenalty[1]
              ? "1"
              : "0";
          newTeamB.winTieBreak =
            newTeamB.teamInTournament.team.id == splitResultPenalty[1]
              ? "1"
              : "0";
          newTeamA.scorePenalty =
            newTeamA.teamInTournament.team.id == splitResultPenalty[1]
              ? +splitResultPenalty[0]
              : +splitResultPenalty[2];
          newTeamB.scorePenalty =
            newTeamB.teamInTournament.team.id == splitResultPenalty[1]
              ? +splitResultPenalty[0]
              : +splitResultPenalty[2];
        } else {
          newTeamA.winTieBreak = +scoreA > +scoreB ? "1" : "0";
          newTeamB.winTieBreak = +scoreB > +scoreA ? "1" : "0";
        }
      }
    } else if (type === 2) {
      newTeamA.yellowCardNumber = +yellowA;
      newTeamB.yellowCardNumber = +yellowB;
    } else {
      newTeamA.redCardNumber = +redA;
      newTeamB.redCardNumber = +redB;
    }

    setLoading(true);

    for (let i = 0; i < 2; i++) {
      await updateInAPI(i === 0 ? newTeamA : newTeamB);
    }

    await deleteMatchDetailByType(
      idMatch,
      type === 1 ? "score" : type === 2 ? "yellow" : "red",
      data
    );

    await updateScoreTeamInTour();
    await updateScorePrediction();

    if (tourDetail.tournamentTypeId !== 2) {
      if (title === "Chung kết") {
        matchResult();
      }
    } else {
      if (index > 0) {
        if (title !== null) {
          const flagTieBreak = await createTieBreak();
          if (flagTieBreak === false) {
            await updateNextTeamInMatch();
            matchResult();
          }
        } else {
          await updateNextTeamInMatch();
          matchResult();
        }
      }
    }
  };

  const updateNextTeamInMatch = async () => {
    try {
      const data = {
        tournamentId: tourDetail.id,
        matchId: 0,
        groupName: "",
      };

      const response = await updateNextTeamInRoundAPI(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createTieBreak = async () => {
    try {
      const groupName =
        tourDetail.tournamentTypeId !== 2 ? title.includes("Bảng") : null;

      const response = await createTieBreakAPI(
        tourDetail.id,
        groupName !== null ? (groupName ? title.split(" ")[1] : null) : null
      );
      if (response.status === 200) {
        return true;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const matchResult = async () => {
    try {
      const response = await postTournamentResult(idMatch);
    } catch (err) {
      console.error(err);
    }
  };
  const updateScorePrediction = async () => {
    try {
      const response = await putStatusScorePrediction(idMatch);
    } catch (err) {
      console.error(err);
    }
  };
  // const updateRedCardTeamInTour = async () => {
  //   const data = {
  //     "id": tourDetail.id,
  //     "totalYellowCard": 0,
  //     "totalRedCard": 0
  //   }
  //   try{
  //     const response = await updateYellowRedCardInTournamentByTourIdAPI(data);
  //   }catch(err){
  //     console.error(err);
  //   }
  // }
  const updateScoreTeamInTour = async () => {
    try {
      const response = updateScoreInTournamentByTourIdAPI(tourDetail.id);
    } catch (err) {
      console.error(err);
    }
  };
  const deleteMatchDetailByType = async (matchId, type, data) => {
    try {
      const response = await deleteMatchDetailByTypeAPI(matchId, type);
      if (response.status === 200) {
        if (
          (type === "yellow" && (+yellowA !== 0 || +yellowB !== 0)) ||
          (type === "score" && (+scoreA !== 0 || +scoreB !== 0)) ||
          (type === "red" && (+redA !== 0 || +redB !== 0))
        ) {
          for (let item of data) {
            await updateMatchDetail(item);
          }
        }

        toast.success("Cập nhật thành công chi tiết trận đấu", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setHideShow(false);
        setStatusUpdate(true);
        setTypeDetail(null);
        setLoading(false);
      }
    } catch (err) {
      if (err.response.status === 404) {
        for (let item of data) {
          console.log(item);
          await updateMatchDetail(item);
        }
        setLoading(false);
        toast.success("Cập nhật thành công chi tiết trận đấu", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setStatusUpdate(true);
        setTypeDetail(null);
      } else {
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      setHideShow(false);
      console.error(err);
    }
  };
  const updateMatchDetail = async (data) => {
    try {
      const response = await saveRecordInMatchDetail(data);
    } catch (err) {
      console.error(err);
    }
  };
  const updateInAPI = (data) => {
    const response = updateTeamInMatch(data);
    response
      .then((res) => {
        return true;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getTeamInMatchByMatchID = () => {
    setLoading(true);
    const response = getTeamInMatchByMatchIdAPI(idMatch);
    response
      .then((res) => {
        if (res.status === 200) {
          getMatchDetailInFor(
            res.data.teamsInMatch[0].teamInTournament.team.id,
            res.data.teamsInMatch[1].teamInTournament.team.id
          );
          const twoTeamUpdate = res.data.teamsInMatch;
          setTeamA(twoTeamUpdate[0]);
          getPlayerInTournamentByTeamInTourid(
            twoTeamUpdate[0].teamInTournament.id,
            "A"
          );
          setTeamB(twoTeamUpdate[1]);
          getPlayerInTournamentByTeamInTourid(
            twoTeamUpdate[1].teamInTournament.id,
            "B"
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };
  const setAllInfor = () => {
    setScoreA(
      teamA.scoreTieBreak === null ? teamA.teamScore : teamA.scoreTieBreak
    );
    setScoreB(
      teamB.scoreTieBreak === null ? teamB.teamScore : teamB.scoreTieBreak
    );
    setYellowA(teamA.yellowCardNumber);
    setYellowB(teamB.yellowCardNumber);
    setRedA(teamA.redCardNumber);
    setRedB(teamB.redCardNumber);
  };
  const getPlayerInTournamentByTeamInTourid = async (id, type) => {
    try {
      const response = await getAllPlayerInTournamentByTeamInTournamentIdAPI(
        id
      );
      if (response.status === 200) {
        const playerInTounament = response.data.playerInTournaments;

        const listPlayer = playerInTounament.map(async (item, index) => {
          const player = await getPlayerInTeamById(item.playerInTeamId);
          const playerDetail = player.footballPlayer;
          playerDetail.playerInTournamentId = item.id;
          return player.footballPlayer;
        });
        const playersData = await Promise.all(listPlayer);

        if (type === "A") {
          setPlayerA(playersData);
        } else {
          setPlayerB(playersData);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  const getPlayerInTeamById = async (id) => {
    try {
      const response = await getPlayerInTeamByIdAPI(id);
      if (response.status === 200) {
        return response.data;
      }
    } catch (err) {
      console.error(err);
    }
  };
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "scoreA":
        setScoreA(value);
        break;
      case "scoreB":
        setScoreB(value);
        break;
      case "yellowA":
        setYellowA(value);
        break;
      case "yellowB":
        setYellowB(value);
        break;
      case "redA":
        setRedA(value);
        break;
      default:
        setRedB(value);
        break;
    }
  };
  // const cancleResult = (type) => {
  //   if (type === "score") {
  //     setScoreA(null);
  //     setScoreB(null);
  //     //setStateScore(false);
  //   } else if (type === "yellow") {
  //     setYellowA(null);
  //     setYellowB(null);
  //     //setStateYellow(false);
  //   } else {
  //     setRedA(null);
  //     setRedB(null);
  //     //setStateRed(false);
  //   }
  // };
  // const acceptResult = (type) => {
  //   if (type === "score" ) {
  //     setStateScore(true);
  //   } else if (type === "yellow" ) {
  //     setStateYellow(true);
  //   } else if (type === "red" ) {
  //     setStateRed(true);
  //   }
  // };
  return (
    <div>
      <Header />
      <div className={styles.detailMatch}>
        <div className={styles.linkOption}>
          <Link to={`/findTournaments`} replace className={styles.linkBack}>
            Các giải đấu
          </Link>
          <span className={styles.sw}>{`>>`}</span>
          <Link
            to={`/tournamentDetail/${tourDetail.id}/scheduleTournamentDetail`}
            className={styles.linkBack}
          >
            Lịch thi đấu
          </Link>
          <span className={styles.sw}>{`>>`}</span>
          <Link
            to={`/match/${idMatch}/matchDetail`}
            state={{
              hostTournamentId,
              tourDetail,
              indexMatch,
              title,
              index,
              lastMatch,
            }}
            className={styles.linkBack}
          >
            Trận đấu
          </Link>
          <span className={styles.sw}>{`>>`}</span>
          <Link
            to={`/detailMatch/${idMatch}`}
            state={{ hostTournamentId, tourDetail }}
            className={styles.linkBack}
          >
            Cập nhật tỉ số {teamA !== null ? teamA.match.fight : null}
          </Link>
        </div>
        <h1 className={styles.titleDetail}>
          Cập nhật tỉ số{" "}
          {tourDetail !== null ? tourDetail.tournamentName : null} -{" "}
          {teamA !== null ? teamA.match.fight : null}
        </h1>
        <div className={styles.teamName}>
          {teamA !== null && teamB !== null ? (
            <>
              <p>{teamA.teamName}</p>
              <p className={styles.lineDash}></p>
              <p> {teamB.teamName}</p>
            </>
          ) : null}
        </div>
        <div>
          <p className={styles.titleMin}>
            <img src="/assets/icons/soccer-ball-retina.png" alt="ball" />
            Tỉ số chung cuộc
          </p>
          <div className={styles.wrapUpdateScore}>
            <label htmlFor="scoreA" className="fight">
              {teamA !== null ? teamA.teamName : null}
            </label>
            <input
              name="scoreA"
              value={scoreA === null ? "" : scoreA}
              id="scoreA"
              type="number"
              className={styles.btnInput}
              onChange={onChangeHandler}
            />
            <p className={styles.lineDash}></p>
            <input
              id="scoreB"
              name="scoreB"
              type="number"
              value={scoreB === null ? "" : scoreB}
              className={styles.btnInput}
              onChange={onChangeHandler}
            />
            <label htmlFor="scoreB" className="fight">
              {teamB !== null ? teamB.teamName : null}
            </label>
            {scoreA !== null &&
            scoreB !== null &&
            ((scoreA + "").length > 0 || (scoreB + "").length > 0) ? (
              <div className="btnAccept">
                {/* <button
                  className="cancleCreate"
                  onClick={() => {
                    cancleResult("score");
                  }}
                >
                  Hủy
                </button> */}
              </div>
            ) : null}
          </div>
          {(scoreA + "").length > 0 && (scoreB + "").length > 0 ? (
            <p
              className={styles.deitalScoreFootball}
              onClick={() => {
                setHideShow(true);
                setTypeDetail("score");
                setStatusUpdate(false);
              }}
            >
              Chi tiết bàn thắng
            </p>
          ) : null}
        </div>
        <div>
          <p className={styles.titleMin}>
            <img src="/assets/icons/yellow-card.png" alt="yellow" />
            Tổng số thẻ vàng
          </p>
          <div className={styles.wrapUpdateScore}>
            <label htmlFor="yellowA" className="fight">
              {teamA !== null ? teamA.teamName : null}
            </label>
            <input
              id="yellowA"
              name="yellowA"
              type="number"
              value={yellowA === null ? "" : yellowA}
              onChange={onChangeHandler}
              className={styles.btnInput}
            />
            <p className={styles.lineDash}></p>
            <input
              id="yellowB"
              name="yellowB"
              type="number"
              value={yellowB === null ? "" : yellowB}
              onChange={onChangeHandler}
              className={styles.btnInput}
            />
            <label htmlFor="yellowB" className="fight">
              {teamB !== null ? teamB.teamName : null}
            </label>
            {yellowA !== null &&
            yellowB !== null &&
            (yellowA + "").length > 0 &&
            (yellowB + "").length > 0 ? (
              <div className="btnAccept">
                {/* <button
                  className="cancleCreate"
                  onClick={() => {
                    cancleResult("yellow");
                  }}
                >
                  Hủy
                </button> */}
              </div>
            ) : null}
          </div>
          {(yellowA + "").length > 0 && (yellowB + "").length > 0 ? (
            <p
              className={styles.deitalScoreFootball}
              onClick={() => {
                setHideShow(true);
                setTypeDetail("yellow");
                setStatusUpdate(false);
              }}
            >
              Chi tiết thẻ vàng
            </p>
          ) : null}
        </div>
        <div>
          <p className={styles.titleMin}>
            {" "}
            <img src="/assets/icons/red-card.png" alt="red" />
            Tổng số thẻ đỏ
          </p>
          <div className={styles.wrapUpdateScore}>
            <label htmlFor="redA" className="fight">
              {teamA !== null ? teamA.teamName : null}
            </label>
            <input
              id="redA"
              className={styles.btnInput}
              name="redA"
              type="number"
              value={redA === null ? "" : redA}
              onChange={onChangeHandler}
            />
            <p className={styles.lineDash}></p>
            <input
              id="redB"
              className={styles.btnInput}
              name="redB"
              type="number"
              value={redB === null ? "" : redB}
              onChange={onChangeHandler}
            />
            <label htmlFor="redB" className="fight">
              {teamB !== null ? teamB.teamName : null}
            </label>
            {redA !== null &&
            redB !== null &&
            (redA + "").length > 0 &&
            (redB + "").length > 0 ? (
              <div className="btnAccept">
                {/* <button
                  className="cancleCreate"
                  onClick={() => {
                    cancleResult("red");
                  }}
                >
                  Hủy
                </button> */}
              </div>
            ) : null}
          </div>
          {(redA + "").length > 0 && (redB + "").length > 0 ? (
            <p
              className={styles.deitalScoreFootball}
              onClick={() => {
                setHideShow(true);
                setTypeDetail("red");
                setStatusUpdate(false);
              }}
            >
              Chi tiết thẻ đỏ
            </p>
          ) : null}
        </div>
      </div>
      <div className={hideShow ? "overlay active" : "overlay"}></div>

      <DetailInMatch
        nameTeamA={teamA !== null ? teamA : null}
        nameTeamB={teamB !== null ? teamB : null}
        hideShow={hideShow}
        updateScoreInMatch={updateScoreInMatch}
        matchDetail={matchDetail}
        setMatchDetail={setMatchDetail}
        setHideShow={setHideShow}
        setStatusUpdate={setStatusUpdate}
        statusUpdate={statusUpdate}
        typeDetail={typeDetail}
        numTeamA={
          typeDetail === "score"
            ? scoreA
            : typeDetail === "yellow"
            ? yellowA
            : redA
        }
        numTeamB={
          typeDetail === "score"
            ? scoreB
            : typeDetail === "yellow"
            ? yellowB
            : redB
        }
        playerA={playerA !== null ? playerA : null}
        playerB={playerB !== null ? playerB : null}
        idMatch={idMatch}
        tourDetail={tourDetail !== null ? tourDetail : null}
        indexMatch={indexMatch}
        title={title}
        lastMatch={lastMatch}
        createTieBreak={createTieBreak}
      />
      {loading ? <LoadingAction /> : null}
      <Footer />
    </div>
  );
}
