import React, { useState, useEffect, useRef } from "react";
import { getAPI } from "../../api/index";
import LoadingAction from "../LoadingComponent/LoadingAction";
import { toast } from "react-toastify";
import {
  addTeamInTournamentAPI,
  updateStatusTeamInTournament,
  updateTeamInScheduleAPI,
} from "../../api/TeamInTournamentAPI";
import { addPlayerInTournamentAPI } from "../../api/PlayerInTournamentAPI";
import { NotiFootballInTournamentAPI } from "../../api/System";
import postNotifacation from "../../api/NotificationAPI";
import { async } from "@firebase/util";
import { getPlayerBusyInTeambyTeamIdAPI } from "../../api/PlayerInTeamAPI";
export default function AcceptPrivateTour(props) {
  const {
    idUser,
    tourDetail,
    setCheckRegistertour,
    hideShow,
    setHideShow,
    teamInTour,
    loading,
    setLoading,
    team,
  } = props;
  const [playerInTeam, setPlayerInTeam] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [countChoice, setCountChoice] = useState(0);
  const [listClothes, setListClothes] = useState([]);
  const [error, setError] = useState(false);
  const rowRef = useRef();
  useEffect(() => {
    getListPlayerInTeamByIdTeam();
  }, [idUser]);
  // console.log(tourDetail);
  const getListPlayerInTeamByIdTeam = async () => {
    setLoading(true);
    const afterURL = `PlayerInTeam?teamId=${idUser}&status=true&pageIndex=1&limit=50`;
    const response = await getAPI(afterURL);

    const ids = response.data.playerInTeamsFull;
    const players = ids.map(async (player) => {
      const playerResponse = await getPlayerById(player.footballPlayerId);
      playerResponse.idPlayerInTeam = player.id;
      playerResponse.choice = false;
      playerResponse.clothesNumber = -1;
      return playerResponse;
    });
    const playersData = await Promise.all(players);
    playersData.countList = response.data.countList;
    console.log(playersData);
    deletePlayerBusyInAnotherTournament(playersData);
  };

  const deletePlayerBusyInAnotherTournament = async (data) => {
    //console.log(data);
    try {
      const response = await getPlayerBusyInTeambyTeamIdAPI(idUser);
      if (response.status === 200) {
        const playerBusy = response.data.playerInTeamsFull;
        const newData = [];
        for (let index in data) {
          if (index !== "countList") {
            let flag = false;
            for (let indexRes in playerBusy) {
              if (data[index].idPlayerInTeam === playerBusy[indexRes].id) {
                flag = true;
                break;
              }
            }
            if (!flag) {
              newData.push(data[index]);
            }
          }
        }

        setPlayerInTeam(newData);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const getPlayerById = async (idPlayer) => {
    const afterURL = `football-players/${idPlayer}`;
    const response = await getAPI(afterURL);
    return response.data;
  };
  const getNumberInField = () => {
    if (tourDetail.footballFieldTypeId === 1) {
      return 5;
    } else if (tourDetail.footballFieldTypeId === 2) {
      return 7;
    } else return 11;
  };

  // const checkDuplicateClothes = (data) => {
  //   const checkDup = listClothes.findIndex((item) => item === data);
  //   if(checkDup === -1){
  //     setListClothes([
  //       ...listClothes,data
  //     ])
  //   }
  // }

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    const allPlayer = playerInTeam;
    if (name === "checkChoicePlayer") {
      if (allPlayer[value].choice) {
        allPlayer[value].choice = false;
        setCountChoice(countChoice - 1);
      } else {
        allPlayer[value].choice = true;
        setCountChoice(countChoice + 1);
      }
    } else {
      const getIndex = name.split("t")[2];
      console.log(getIndex);
      allPlayer[getIndex].clothesNumber = value;
    }
    setPlayerInTeam(allPlayer);
  };

  const addTeamInTournament = () => {
    setLoading(true);
    const getPlayerChoice = getPlayerChoiceRegister();
    const mininumPlayer = getNumberInField();
    console.log(getPlayerChoice.length);
    if (getPlayerChoice.length < mininumPlayer) {
      setLoading(false);
      toast.error(`Bạn phải đăng ký tối thiểu ${mininumPlayer} cầu thủ`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      const flagValidateNumber = validateNumberClothes(getPlayerChoice);
      if (flagValidateNumber === false) {
        setLoading(false);
        toast.error("Số áo cầu thủ không được trùng", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const data = {
          id: teamInTour.id,
          point: teamInTour.point,
          winScoreNumber: teamInTour.winScoreNumber,
          loseScoreNumber: teamInTour.loseScoreNumber,
          totalYellowCard: teamInTour.totalYellowCard,
          totalRedCard: teamInTour.totalRedCard,
          status: "Tham gia",
          statusInTournament: teamInTour.statusInTournament,
          tournamentId: teamInTour.tournamentId,
          teamId: teamInTour.teamId,
        };
        const response = updateStatusTeamInTournament(data);
        response
          .then((res) => {
            if (res.status === 201) {
              //setLoading(false);
              addTeamInSchedule(res.data.id, true, getPlayerChoice);
              //console.log(res.data);
            }
          })
          .catch((err) => {
            setLoading(false);
            console.error(err);
            toast.error(err.response.data, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
      }
    }
  };

  const validateNumberClothes = (data) => {
    const newNumber = [];

    for (const item of data) {
      if (newNumber.length === 0) {
        newNumber.push(item.clothesNumber);
      } else {
        const findIndex = newNumber.findIndex(
          (itemFind) => itemFind === item.clothesNumber
        );
        if (findIndex === -1) newNumber.push(item.clothesNumber);
        else return false;
      }
    }
    return true;
  };

  const sendMailNotiPlayer = (tourId, playerId, teamId) => {
    const response = NotiFootballInTournamentAPI(tourId, playerId, teamId);
    response
      .then((res) => {
        if (res.status === 200) {
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const getPlayerChoiceRegister = () => {
    console.log(playerInTeam);
    const getPlayerChoice = playerInTeam.reduce((accumulator, currentValue) => {
      if (currentValue.choice === true) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);
    console.log(getPlayerChoice);
    return getPlayerChoice;
  };
  const addPlayerInTournament = (id, getPlayerChoice) => {
    getPlayerChoice.map((iteam, index) => {
      const data = {
        teamInTournamentId: id,
        playerInTeamId: iteam.idPlayerInTeam,
        status: "string",
        clothesNumber: +iteam.clothesNumber,
      };
      console.log("sadsada" + id);
      const response = addPlayerInTournamentAPI(data);
      response
        .then((res) => {
          sendMailNotiPlayer(tourDetail.id, iteam.userVM.id, idUser);
        })
        .catch((err) => {
          console.error(err);
        });
    });
    setCheckRegistertour(true);
    setHideShow(false);
    //   getAllTeamInTournamentByTourId();
    toast.success("Tham gia giải đấu thành công ", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    postNotificationforTeamManager();
    setLoading(false);
    setHideShow(false);
  };

  const postNotificationforTeamManager = async () => {
    const data = {
      content: `${team.teamName} đã đồng ý tham gia ${tourDetail.tournamentName} của bạn.Xem ngay`,
      userId: tourDetail.userId,
      tournamentId: tourDetail.id,
      teamId: 0,
    };
    try {
      const response = await postNotifacation(data);
      if (response.status === 201) {
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addTeamInSchedule = (idTeamInTour, status, getPlayerChoice) => {
    const data = {
      teamInTournamentId: idTeamInTour,
      typeUpdate: status,
    };
    const response = updateTeamInScheduleAPI(data);
    response
      .then((res) => {
        if (res.status === 200) {
          addPlayerInTournament(idTeamInTour, getPlayerChoice);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  // const checkChoice = (index) => {
  //   const allPlayer = playerInTeam;
  //   console.log(allPlayer[index].choice)
  //   if(allPlayer[index].choice){
  //     allPlayer[index].choice = false;
  //   }else{
  //     allPlayer[index].choice = true;
  //   }
  //   console.log(allPlayer);
  //   setPlayerInTeam(allPlayer);
  // }
  const onSubmitHandler = (e) => {
    e.preventDefault();
    addTeamInTournament();
  };
  const onRowClick = () => {
    rowRef.current.focus();
    console.log(rowRef.current);
    // rowRef.current.disabled = false;
  };
  return (
    <>
      {/* {loading ? <LoadingAction /> : null} */}

      <div
        className={hideShow ? "popup__player active" : "popup__player"}
        id="exampleModal"
      >
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: 24,
                }}
                class="modal-title"
                id="exampleModalLabel"
              >
                Đăng ký cầu thủ vào giải đấu
              </h3>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setHideShow(false)}
              ></button>
            </div>
            <form onSubmit={onSubmitHandler}>
              <div
                style={{
                  justifyContent: "flex-start",
                }}
                class="modal-body"
              >
                {playerInTeam != null &&
                playerInTeam.countList < getNumberInField() ? (
                  <h1
                    style={{
                      fontWeight: 600,
                      fontSize: 20,
                      color: "red",
                    }}
                  >
                    Đội bóng của bạn không đủ thành viên để tham gia giải đấu,
                    tối thiểu đội bóng phải có {getNumberInField()} cầu thủ
                  </h1>
                ) : (
                  <div>
                    <h1
                      style={{
                        fontWeight: 600,
                        fontSize: 20,
                        marginBottom: 10,
                      }}
                    >
                      Danh sách cầu thủ
                    </h1>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: 16,
                          fontStyle: "italic",
                          marginBottom: 10,
                        }}
                      >
                        Lưu ý: Chọn ít nhất {getNumberInField()} cầu thủ - tối
                        đa {tourDetail.footballPlayerMaxNumber} cầu thủ
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                        }}
                      >
                        {error ? (
                          <p
                            style={{
                              color: "red",
                              fontWeight: 600,
                              fontSize: 18,
                              marginRight: 20,
                            }}
                          >
                            Số áo bị trùng
                          </p>
                        ) : null}

                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: 18,
                            marginRight: 15,
                          }}
                        >
                          Số cầu thủ đã chọn {countChoice}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        width: "73vw",
                        height: 350,
                        overflowY: "scroll",
                      }}
                    >
                      <table
                        className="choicePlayerTable"
                        style={{
                          width: "72vw",
                        }}
                        class="table"
                      >
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th
                              style={{
                                width: "29%",
                              }}
                            >
                              Email
                            </th>
                            <th>Tên</th>
                            <th>Số áo</th>
                            <th>Chọn</th>
                          </tr>
                        </thead>
                        <tbody className="listFootballPlayerChoice">
                          {playerInTeam != null
                            ? playerInTeam.map((item, index) => {
                                return (
                                  <tr
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    onClick={onRowClick}
                                    key={index}
                                  >
                                    <td>{index + 1}</td>
                                    <td>{item.userVM.email}</td>

                                    <td
                                    // style={{
                                    //   textAlign: "center"
                                    // }}
                                    >
                                      {/* {" "}
                                    <div
                                      style={{
                                        width: 70,
                                        height: 70,
                                        overflow: "hidden",
                                        marginBottom: 10
                                      }}
                                    >
                                      <img
                                        style={{
                                          objectFit: "cover",
                                        }}
                                        src={item.playerAvatar}
                                        alt="avatarPlayer"
                                      />
                                    </div>{" "} */}
                                      {item.playerName}
                                    </td>

                                    <td>
                                      <input
                                        type="text"
                                        placeholder="Nhập số áo"
                                        disabled={!item.choice}
                                        name={`clothesNumberInput${index}`}
                                        onChange={onChangeHandler}
                                        ref={rowRef}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="checkbox"
                                        name="checkChoicePlayer"
                                        // defaultChecked={item.choice}
                                        onChange={onChangeHandler}
                                        value={index}
                                        // ref={rowRef}
                                      />
                                    </td>
                                  </tr>
                                );
                              })
                            : null}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              <div class="modal-footer">
                <button
                  style={{
                    padding: 10,
                  }}
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setHideShow(false)}
                >
                  Đóng
                </button>
                {playerInTeam != null &&
                playerInTeam.countList < getNumberInField() ? null : (
                  <input
                    style={{
                      padding: 10,
                    }}
                    type="submit"
                    class="btn btn-primary"
                    value=" Lưu danh sách"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
