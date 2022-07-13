import React, { useEffect, useState } from "react";

export default function DetailInMatch(props) {
  const {
    hideShow,
    setHideShow,
    typeDetail,
    nameTeamA,
    nameTeamB,
    numTeamA,
    numTeamB,
    playerA,
    playerB,
    matchDetail,
    idMatch,
    updateScoreInMatch,
    statusUpdate,
    setStatusUpdate,
    tourDetail,
  } = props;
  const [detail, setDetail] = useState([]);
  const [newMatchDetail, setNewMatchDetail] = useState(null);
  let matchMinutes = null;
  useEffect(() => {
    matchMinutes = tourDetail !== null ? tourDetail.matchMinutes : null;
    if (typeDetail === "score" && matchDetail !== null) {
      const score = [];
      for (let i = 0; i < matchDetail.length; i++) {
        if (matchDetail[i].matchScore === 1) {
          score.push(matchDetail[i]);
        }
      }
    } else if (typeDetail === "yellow" && matchDetail !== null) {
      const yellow = [];
      for (let i = 0; i < matchDetail.length; i++) {
        if (matchDetail[i].yellowCardNumber === 1) {
          yellow.push(matchDetail[i]);
        }
      }
    } else if (typeDetail === "red" && matchDetail !== null) {
      const red = [];
      for (let i = 0; i < matchDetail.length; i++) {
        if (matchDetail[i].redCardNumber === 1) {
          red.push(matchDetail[i]);
        }
      }
    }
    coverMatchDetail();
  }, [typeDetail, statusUpdate === false]);

  const coverMatchDetail = () => {
    if (matchDetail !== null) {
      const newMatchDetail = [];
      if (typeDetail === "score") {
        matchDetail.map((item, index) => {
          if (item.actionMatchId === 1) {
            newMatchDetail.push(item);
          }
        });
      } else if (typeDetail === "yellow") {
        matchDetail.map((item, index) => {
          if (item.actionMatchId === 2) {
            newMatchDetail.push(item);
          }
        });
      } else {
        matchDetail.map((item, index) => {
          if (item.actionMatchId === 3) {
            newMatchDetail.push(item);
          }
        });
      }

      getDataDetail(newMatchDetail);
      setNewMatchDetail(newMatchDetail);
    }
  };

  const renderSelectByNumber = (data, playerId) => {
    if (data != undefined) {
      let array = [];
      for (let i = -1; i < data.length; i++) {
        if (i === -1) {
          if (playerId == null)
            array.push(<option selected>Chọn cầu thủ</option>);
          else array.push(<option>Chọn cầu thủ</option>);
        } else {
          if (playerId !== null) {
            array.push(
              <option
                value={JSON.stringify(data[i])}
                selected={
                  playerId === data[i].playerInTournamentId
                    ? JSON.stringify(data[i])
                    : null
                }
              >
                {data[i].playerName}
              </option>
            );
          } else {
            array.push(
              <option value={JSON.stringify(data[i])}>
                {data[i].playerName}
              </option>
            );
          }
        }
      }
      return array;
    }
  };
  const getDataDetail = (data) => {
    const player = [];
    const newPlayerA = [];
    if (data !== null) {
      const idTeamA = nameTeamA.teamInTournament.team.id;
      for (let index in data) {
        if (idTeamA === data[index].playerInTournament.playerInTeam.teamId) {
          newPlayerA.push({
            id: index,
            actionMatchId: data[index].actionMatchId,
            actionMinute: data[index].actionMinute,
            matchId: data[index].matchId,
            playerInTournamentId: data[index].playerInTournament.id,
          });
        }
      }
      newPlayerA.sort(function (a, b) {
        return a.actionMinute - b.actionMinute;
      });
      player.push(...newPlayerA);
      const newPlayerB = [];
      const idTeamB = nameTeamB.teamInTournament.team.id;
      for (let index in data) {
        if (idTeamB === data[index].playerInTournament.playerInTeam.teamId)
          newPlayerB.push({
            id: index,
            actionMatchId: data[index].actionMatchId,
            actionMinute: data[index].actionMinute,
            matchId: data[index].matchId,
            playerInTournamentId: data[index].playerInTournament.id,
          });
      }

      newPlayerB.sort(function (a, b) {
        return a.actionMinute - b.actionMinute;
      });
      player.push(...newPlayerB);
      setDetail(player);
    }
  };
  const renderSelectByMinutes = (data) => {
    let array = [];
    console.log(tourDetail.matchMinutes);
    for (let i = 0; i <= tourDetail.matchMinutes * 2; i++) {
      if (i === 0) {
        if (data == null) array.push(<option selected>TG</option>);
        else array.push(<option>TG</option>);
      } else {
        if (data !== null) {
          array.push(
            <option value={[i]} selected={+data === i ? [i] : null}>
              {i}
            </option>
          );
        } else {
          array.push(<option value={i}>{i}</option>);
        }
      }
    }
    return array;
  };
  const renderInputByNumber = (number, data, type) => {
    let array = [];
    
    for (let i = 0; i < number; i++) {
      let calc = i + +numTeamA;
      array.push(
        <div
          style={{
            display: "flex",
          }}
        >
          <select
            name={type === "B" ? i + +numTeamA + "-object" : i + "-object"}
            onChange={onChangeHandler}
            style={{
              marginRight: 20,
              padding: "10px 20px",
              marginBottom: 20,
            }}
          >
            {renderSelectByNumber(
              data,
              detail !== null && detail.length === +numTeamA + +numTeamB
                ? type === "B"
                  ? detail[calc].playerInTournamentId
                  : detail[i].playerInTournamentId
                : null
              // ,
              // player.length > 0 ? player[i].idPlayer : null
            )}
          </select>
          <select
            onChange={onChangeHandler}
            name={type === "B" ? i + +numTeamA + "-minutes" : `${i}-minutes`}
            style={{
              width: 50,
              marginBottom: 20,
            }}
          >
            {renderSelectByMinutes(
              detail !== null && detail.length === +numTeamA + +numTeamB
                ? type === "B"
                  ? detail[calc].actionMinute
                  : detail[i].actionMinute
                : null
            )}
          </select>
          {/* <input
            value={
              detail !== null && detail.length === +numTeamA + +numTeamB
                ? type === "B"
                  ? detail[calc].actionMinute
                  : detail[i].actionMinute
                : null
            }
            className="btnInput"
            style={{
              margin: "10px 0",
            }}
          /> */}
        </div>
      );
    }
    return array;
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    const id = name.split("-")[0];
    const type = name.split("-")[1];
    const valueObj = JSON.parse(value);

    if (detail !== null && detail.length > 0) {
      const newDetail = detail;
      const findIndex = newDetail.findIndex((item, index) => item.id === id);
      if (findIndex === -1) {
        newDetail.push({
          id: id,
          actionMatchId:
            typeDetail === "score" ? 1 : typeDetail === "yellow" ? 2 : 3,
          actionMinute: type === "object" ? null : valueObj + "",
          matchId: +idMatch,
          playerInTournamentId:
            type === "object" ? valueObj.playerInTournamentId : null,
        });
      } else {
        if (type === "object")
          newDetail[findIndex].playerInTournamentId =
            valueObj.playerInTournamentId;
        else newDetail[findIndex].actionMinute = valueObj + "";
      }
      setDetail(newDetail);
    } else {
      setDetail([
        {
          id: id,
          actionMatchId:
            typeDetail === "score" ? 1 : typeDetail === "yellow" ? 2 : 3,
          actionMinute: type === "object" ? null : valueObj + "",
          matchId: +idMatch,
          playerInTournamentId:
            type === "object" ? valueObj.playerInTournamentId : null,
        },
      ]);
    }
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
    for (let item of detail) {
      delete item.id;
    }
    updateScoreInMatch(
      detail,
      typeDetail === "score" ? 1 : typeDetail === "yellow" ? 2 : 3
    );
    setNewMatchDetail(null);
  };
  return (
    <div>
      <div
        id="exampleModal"
        className={hideShow ? "popup__player active" : "popup__player"}
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <form onSubmit={onSubmitHandler}>
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  Chi tiết{" "}
                  {typeDetail === "score"
                    ? "bàn thắng"
                    : typeDetail === "yellow"
                    ? "thẻ vàng"
                    : "thẻ đỏ"}
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setHideShow(false);
                    setNewMatchDetail([]);
                    setStatusUpdate(true);
                  }}
                ></button>
              </div>
              <div
                class="modal-body"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  lineHeight: 2,
                }}
              >
                <div>
                  <p
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    {nameTeamA !== null && nameTeamB !== null
                      ? nameTeamA.teamName + "-" + nameTeamB.teamName
                      : null}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: 30,
                    width: "100%",
                    justifyContent: "space-around",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {renderInputByNumber(numTeamA, playerA, "A")}
                  </div>
                  <div>{renderInputByNumber(numTeamB, playerB, "B")}</div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    setHideShow(false);
                    setNewMatchDetail([]);
                    setStatusUpdate(true);
                  }}
                  style={{
                    padding: "10px 15px",
                  }}
                >
                  Đóng
                </button>
                <button
                  style={{
                    padding: "10px 15px",
                  }}
                  type="submit"
                  class="btn btn-primary"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
