import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { getAPI } from "../../api";
import LoadingAction from "../LoadingComponent/LoadingAction";
import styles from "../FindTeamComponent/TeamFind.module.css";
import DenyTeamInTournament from "../TournamentDetailComponent/DenyTeamInTournament";
import { Link } from "react-router-dom";
import ViewListPlayerRegister from "../TournamentDetailComponent/ViewListPlayerRegister";
import { toast } from "react-toastify";
import {
  deleteRegisterTeamAPI,
  updateStatusTeamInTournament,
  updateTeamInScheduleAPI,
} from "../../api/TeamInTournamentAPI";
import {
  deletePlayerInTournamentById,
  getAllPlayerInTournamentByTeamInTournamentIdAPI,
} from "../../api/PlayerInTournamentAPI";
import RegisterInTournament from "../TournamentDetailComponent/RegisterInTournament";
import AcceptPrivateTour from "./AcceptPrivateTour";
function TournamentTeamDetail(props) {
  const { user, team } = props;
  const [checkRegisterTour, setCheckRegistertour] = useState(false);
  const [teamInTour, setTeamInTour] = useState([]);
  const [hideShow, setHideShow] = useState(false);
  const [hideShowRegis, setHideShowRegis] = useState(false);
  const [hideShowDelete, setHideShowDelete] = useState(false);
  const [viewList, setViewList] = useState(null);
  const [tourTeam, setTourTeam] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setactive] = useState(1);
  const [statusTeam, setStatusTeam] = useState("Tham gia");
  const [typeReport, setTypeReport] = useState("report");
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
    getTeamInTournament();
    setCheck(!check);
  };

  const [teamDelete, setTeamDelete] = useState(null);

  const onSubmitHandler = (e) => {
    e.preventDefault();
  };

  const getAllPlayerInTournamentByIdTeam = (idTeam) => {
    setLoading(true);
    const response = getAllPlayerInTournamentByTeamInTournamentIdAPI(idTeam);
    response
      .then((res) => {
        if (res.status === 200) {
          // console.log(res);
          // for (let item of res.data.playerInTournaments) {
          //   deletePlayerById(item.id);
          // }
          console.log(idTeam);
          setTimeout(() => {
            deleteTeamInTournament(idTeam);
          }, 2000);
        }
      })
      .catch((err) => {
        setLoading(false);
        setHideShowDelete(false);
        console.error(err);
      });
  };

  const deletePlayerById = async (id) => {
    try {
      const response = await deletePlayerInTournamentById(id);
    } catch (err) {
      setLoading(false);
      setHideShowDelete(false);
      console.error(err);
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
  };

  const getType = (id) => {
    if (1 === id) {
      return "Loa??i tr????c ti????p";
    }
    if (2 === id) {
      return "??a?? vo??ng tro??n";
    }
    if (3 === id) {
      return "??a?? chia ba??ng";
    } else {
      return "";
    }
  };

  const getFeild = (id) => {
    if (1 === id) {
      return " | S??n 5";
    }
    if (2 === id) {
      return " | S??n 7";
    }
    if (3 === id) {
      return " | S??n 11";
    } else {
      return "";
    }
  };

  const getGender = (gender) => {
    if (gender === "Male") {
      return "Gia??i ??????u Nam";
    } else {
      return "Gia??i ??????u N????";
    }
  };

  const deleteTeamInTournament = (id) => {
    const response = deleteRegisterTeamAPI(id);
    response
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setHideShowDelete(false);
          setLoading(false);
          setTypeReport("report");
          setCheck(!check);
          toast.success(
            typeReport !== "outtournament"
              ? "T??? ch???i gia??i ??????u th??nh c??ng"
              : "Gia??i ??????u ???? h???y tham gia gi???i th??nh c??ng",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
        }
      })
      .catch((err) => {
        setHideShow(false);
        setLoading(false);
        console.error(err);
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const getTeamInTournament = async () => {
    try {
      let afterURLDefault = null;
      afterURLDefault = `team-in-tournaments?team-id=${team.id}&status=${statusTeam}&page-offset=${currentPage}&limit=8`;
      setLoading(true);
      const res = await getAPI(afterURLDefault);

      if (res.status === 200) {
        console.log(res.data.teamInTournaments);
        setCount(res.data.countList);
        const ids = res.data.teamInTournaments;
        const tours = ids.map(async (tour) => {
          const tourResponse = await getTournamentByID(tour.tournamentId);
          tourResponse.idPlayerInTeam = tour.id;
          return tourResponse;
        });

        const toursData = await Promise.all(tours);
        setTourTeam(toursData);
        setTeamInTour(res.data.teamInTournaments);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getTournamentByID = async (idTour) => {
    const afterURL = `tournaments/${idTour}`;
    const response = await getAPI(afterURL);
    return response.data;
  };
  useEffect(() => {
    getTeamInTournament();
  }, [currentPage, check, statusTeam, hideShow,hideShowRegis]);

  const addTeamInSchedule = (idTeamInTour) => {
    const data = {
      teamInTournamentId: idTeamInTour,
    };
    const response = updateTeamInScheduleAPI(data);
    response
      .then((res) => {
        if (res.status === 200) {
          setHideShow(false);
          setCheck(!check);
          toast.success("?????i b??ng ???? ???????c th??m v??o gi???i", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const acceptTeamInTournament = (teamInTournament, status) => {
    if (teamInTournament != null) {
      const data = {
        ...teamInTournament,
        status: status ? "Tham gia" : "T??? ch???i",
      };
      setLoading(true);
      const response = updateStatusTeamInTournament(data);
      response
        .then((res) => {
          if (res.status === 201) {
            // getTourDetail();
            addTeamInSchedule(teamInTournament.tournamentId);
          }
        })
        .catch((err) => {
          setHideShow(false);
          setLoading(false);
          console.error(err);
          toast.error(err.response.data.message, {
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
  };

  return (
    <div className="tournamentdetail">
      {loading ? <LoadingAction /> : null}
      <div className="teamdetail__content listPlayer schedule__tour">
        <h3 className="listPlayer__title">Danh sa??ch gia??i tham gia</h3>
        <div className="listPlayer__total">
          <h2>
            {" "}
            {tourTeam != null && tourTeam.length > 0
              ? "Co?? " + count + " gia??i ??????u"
              : "Ch??a c?? gia??i ??????u "}
          </h2>
          <div className="option__view">
            <p
              className={active === 1 ? "active" : ""}
              onClick={() => {
                setactive(1);
                setStatusTeam("Tham gia");
              }}
            >
              Tham gia
            </p>
            <p
              className={active === 2 ? "active" : ""}
              onClick={() => {
                setactive(2);
                setStatusTeam("Ch??? duy???t");
              }}
            >
              ??a?? ????ng ky??
            </p>
            <p
              className={active === 3 ? "active" : ""}
              onClick={() => {
                setactive(3);
                setStatusTeam("Ch??? duy???t private");
              }}
            >
              Ch??? duy???t
            </p>
          </div>
        </div>
        {active === 1 ? (
          <div className="listPlayer__list">
            {" "}
            {tourTeam != null && tourTeam.length > 0 ? (
              tourTeam.map((item, index) => {
                return (
                  <div key={index} className="listPlayer__item">
                    <Link
                      to={`/tournamentDetail/${item.id}/inforTournamentDetail`}
                    >
                      <div className="test">
                        <img src={item.tournamentAvatar} alt="team" />
                      </div>
                      <div className="des">
                        <p className="namePlayer">
                          <span>T??n gia??i:</span>
                          {item.tournamentName}
                        </p>
                        <p className="mailPlayer">
                          <span>Gia??i ??????u:</span>
                          {getGender(item.tournamentGender)}
                        </p>
                        <p className="genderPlayer">
                          <span>Hi??nh th????c:</span>
                          {getType(item.tournamentTypeId)}
                          {getFeild(item.footballFieldTypeId)}
                        </p>
                        <p className="phonePlayer">
                          <span>Khu v????c:</span>
                          {item.footballFieldAddress}
                        </p>
                        <p
                          className="list_regis"
                          style={{
                            color: "#D7FC6A",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setViewList(teamInTour[index]);
                          }}
                        >
                          Danh s??ch c???u th??? ????ng k??
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              <h1
                style={{
                  color: "red",
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                Ch??a tham gia gia??i ??????u
              </h1>
            )}
          </div>
        ) : null}
        {active === 2 ? (
          <div className="listPlayer__list">
            {" "}
            {tourTeam != null && tourTeam.length > 0 ? (
              tourTeam.map((item, index) => {
                return (
                  <div key={index} className="listPlayer__item">
                    <Link
                      to={`/tournamentDetail/${item.id}/inforTournamentDetail`}
                    >
                      <div className="test">
                        <img src={item.tournamentAvatar} alt="team" />
                      </div>
                      <div className="des">
                        <p className="namePlayer">
                          <span>T??n gia??i:</span>
                          {item.tournamentName}
                        </p>
                        <p className="mailPlayer">
                          <span>Gia??i ??????u:</span>
                          {getGender(item.tournamentGender)}
                        </p>
                        <p className="genderPlayer">
                          <span>Hi??nh th????c:</span>
                          {getType(item.tournamentTypeId)}
                          {getFeild(item.footballFieldTypeId)}
                        </p>
                        <p className="phonePlayer">
                          <span>Khu v????c:</span>
                          {item.footballFieldAddress}
                        </p>
                        <p
                          className="list_regis"
                          style={{
                            color: "#D7FC6A",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setViewList(teamInTour[index]);
                          }}
                        >
                          Danh s??ch c???u th??? ????ng k??
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              <h1
                style={{
                  color: "red",
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                Ch??a tham gia gia??i ??????u
              </h1>
            )}
          </div>
        ) : null}
        {active === 3 ? (
          <div className="listPlayer__list">
            {tourTeam != null && tourTeam.length > 0 ? (
              tourTeam.map((item, index) => {
                return (
                  <form onSubmit={onSubmitHandler}>
                    <div key={index} className="listPlayer__item">
                      <Link
                        to={`/tournamentDetail/${item.id}/inforTournamentDetail`}
                      >
                        <div className="test">
                          <img src={item.tournamentAvatar} alt="team" />
                        </div>
                      </Link>

                      <div className="des">
                        <p className="namePlayer">
                          <span>T??n gia??i:</span>
                          {item.tournamentName}
                        </p>
                        <p className="mailPlayer">
                          <span>Gia??i ??????u:</span>
                          {getGender(item.tournamentGender)}
                        </p>
                        <p className="genderPlayer">
                          <span>Hi??nh th????c:</span>
                          {getType(item.tournamentTypeId)}
                          {getFeild(item.footballFieldTypeId)}
                        </p>
                        <p className="phonePlayer">
                          <span>Khu v????c:</span>
                          {item.footballFieldAddress}
                        </p>
                        {user !== undefined && user.userVM.id === team.id ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              marginTop: 20,
                              marginBottom: 20,
                            }}
                          >
                            <input
                              className="btn_deleteTeam"
                              style={{
                                width: 80,
                                padding: 10,
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                // acceptTeamInTournament(item, false);
                                setTeamDelete(teamInTour[index]);
                                setHideShowDelete(true);
                              }}
                              type="submit"
                              value="T??? ch???i"
                            />
                            <input
                              style={{
                                width: 80,
                                padding: 10,
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                // acceptTeamInTournament(item, true);
                                setHideShowRegis(true);
                              }}
                              type="submit"
                              className="btn_acceptTeam"
                              value="?????ng ??"
                            />
                            <AcceptPrivateTour
                              loading={loading}
                              setLoading={setLoading}
                              teamInTour={teamInTour[index]}
                              tourDetail={item}
                              setCheckRegistertour={setCheckRegistertour}
                              hideShow={hideShowRegis}
                              setHideShow={setHideShowRegis}
                              team={team !== null ? team : null}
                              idUser={
                                user != undefined ? user.userVM.id : undefined
                              }
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </form>
                );
              })
            ) : (
              <h1
                style={{
                  color: "red",
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                Ch??a c?? ?????i b??ng ????ng k??
              </h1>
            )}
            <div
              className={hideShowDelete ? "overlay active" : "overlay"}
            ></div>
            <DenyTeamInTournament
              getAllPlayerInTournamentByIdTeam={
                getAllPlayerInTournamentByIdTeam
              }
              teamDelete={teamDelete}
              setTeamDelete={setTeamDelete}
              setHideShowDelete={setHideShowDelete}
              hideShowDelete={hideShowDelete}
            />
          </div>
        ) : null}
        {tourTeam.length !== 0 ? (
          <nav
            aria-label="Page navigation example"
            className={styles.pagingTournament1}
          >
            <ReactPaginate
              previousLabel={"Trang tr??????c"}
              nextLabel={"Trang sau"}
              containerClassName="pagination"
              activeClassName={styles.active}
              pageClassName={styles.pageItem}
              nextClassName={styles.pageItem}
              previousClassName={styles.pageItem}
              breakLabel={"..."}
              pageCount={Math.ceil(count / 8)}
              marginPagesDisplayed={3}
              onPageChange={handlePageClick}
              pageLinkClassName={styles.pagelink}
              previousLinkClassName={styles.pagelink}
              nextLinkClassName={styles.pagelink}
              breakClassName={styles.pageItem}
              breakLinkClassName={styles.pagelink}
              pageRangeDisplayed={2}
            />
          </nav>
        ) : null}
      </div>
      <div
        className={hideShow || hideShowRegis ? "overlay active" : "overlay"}
      ></div>
      <ViewListPlayerRegister
        teamInTournament={viewList}
        setViewList={setViewList}
        setHideShow={setHideShow}
        hideShow={hideShow}
      />
    </div>
  );
}

export default TournamentTeamDetail;
