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
  getInforTeamInTournamentByTeamId,
} from "../../api/TeamInTournamentAPI";
import {
  deletePlayerInTournamentById,
  getAllPlayerInTournamentByTeamInTournamentIdAPI,
} from "../../api/PlayerInTournamentAPI";
//import RegisterInTournament from "../TournamentDetailComponent/RegisterInTournament";
import AcceptPrivateTour from "./AcceptPrivateTour";
import ModalDenyTeamOutTournament from "./ModalDenyTeamOutTournament";
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
  const [hideShowDenyTeam, setHideShowDenyTeam] = useState(false);
  const [viewMoreOption, setViewMoreOption] = useState({
    index: "0",
    check: false,
  });
  const [teamDelete, setTeamDelete] = useState(null);
  const [idTeamDenyTour, setIdTeamDenyTour] = useState(null);
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

  const denyTeamOutTournament = (idTeam) => {
    setLoading(true);
    const response = getAllPlayerInTournamentByTeamInTournamentIdAPI(idTeam);
    response
      .then((res) => {
        if (res.status === 200) {
          for (let item of res.data.playerInTournaments) {
            deletePlayerById(item.id);
          }

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
      return "Loại trực tiếp";
    }
    if (2 === id) {
      return "Đá vòng tròn";
    }
    if (3 === id) {
      return "Đá chia bảng";
    } else {
      return "";
    }
  };

  const getFeild = (id) => {
    if (1 === id) {
      return " | Sân 5";
    }
    if (2 === id) {
      return " | Sân 7";
    }
    if (3 === id) {
      return " | Sân 11";
    } else {
      return "";
    }
  };

  const getGender = (gender) => {
    if (gender === "Male") {
      return "Giải đấu Nam";
    } else {
      return "Giải đấu Nữ";
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
          setHideShowDenyTeam(false)
          setCheck(!check);
          toast.success("Hủy lời mời tham gia giải đấu thành công ", {
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
  }, [currentPage, check, statusTeam, hideShow, hideShowRegis]);

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
          toast.success("Đội bóng đã được thêm vào giải", {
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
        status: status ? "Tham gia" : "Từ chối",
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
  const getPlayerInTourByTourID = async () => {
    try {
      const response = await getInforTeamInTournamentByTeamId(
        idTeamDenyTour.id,
        team.id
      );

      if (response.status === 200) {
        const data = response.data.teamInTournaments;

        await denyTeamOutTournament(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="tournamentdetail">
      {loading ? <LoadingAction /> : null}
      <div className="teamdetail__content listPlayer schedule__tour">
        <h3 className="listPlayer__title">Danh sách giải tham gia</h3>
        <div className="listPlayer__total">
          <h2>
            {" "}
            {tourTeam != null && tourTeam.length > 0
              ? "Có " + count + " giải đấu"
              : "Chưa có giải đấu "}
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
                setStatusTeam("Chờ duyệt");
              }}
            >
              Đã đăng ký
            </p>
            <p
              className={active === 3 ? "active" : ""}
              onClick={() => {
                setactive(3);
                setStatusTeam("Chờ duyệt private");
              }}
            >
              Chờ duyệt
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
                          <span>Tên giải:</span>
                          {item.tournamentName}
                        </p>
                        <p className="mailPlayer">
                          <span>Giải đấu:</span>
                          {getGender(item.tournamentGender)}
                        </p>
                        <p className="genderPlayer">
                          <span>Hình thức:</span>
                          {getType(item.tournamentTypeId)}
                          {getFeild(item.footballFieldTypeId)}
                        </p>
                        <p className="phonePlayer">
                          <span>Khu vực:</span>
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
                          Danh sách cầu thủ đăng ký
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
                Chưa tham gia giải đấu
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
                    <div>
                      <div
                        className="view__more"
                        onClick={() => {
                          setViewMoreOption({
                            index: index,
                            check: !viewMoreOption.check,
                          });
                        }}
                      >
                        <i className="fa-solid fa-ellipsis"></i>
                      </div>
                      <div
                        className={
                          viewMoreOption.index === index && viewMoreOption.check
                            ? "option__player active"
                            : "option__player"
                        }
                      >
                        {/* <div
                            className={
                              hideShowDeleteTeamOut
                                ? "overlay active"
                                : "overlay"
                            }
                          ></div> */}
                        <p
                          onClick={() => {
                            //deletePlayerInTeam(item.idPlayerInTeam);
                            // setHideShowDelete(true);
                            // setIdDelete(item.idPlayerInTeam);
                            // setDeleteSuccessFul(false);
                            // setHideShowDeleteTeamOut(true);
                            // setIdTeamDelete(
                            //   item.teamInTournament.id + "-" + item.id
                            // );
                            setHideShowDenyTeam(true);
                            setIdTeamDenyTour(item);
                          }}
                        >
                          <i class="fa-solid fa-trash"></i>
                          Hủy lời mời tham gia giải
                        </p>
                      </div>
                      <div
                        className={
                          hideShowDenyTeam ? "overlay active" : "overlay"
                        }
                      ></div>
                      <ModalDenyTeamOutTournament
                        hideShow={hideShowDenyTeam}
                        setHideShow={setHideShowDenyTeam}
                        getPlayerInTourByTourID={getPlayerInTourByTourID}
                      />
                    </div>
                    <Link
                      to={`/tournamentDetail/${item.id}/inforTournamentDetail`}
                    >
                      <div className="test">
                        <img src={item.tournamentAvatar} alt="team" />
                      </div>
                      <div className="des">
                        <p className="namePlayer">
                          <span>Tên giải:</span>
                          {item.tournamentName}
                        </p>
                        <p className="mailPlayer">
                          <span>Giải đấu:</span>
                          {getGender(item.tournamentGender)}
                        </p>
                        <p className="genderPlayer">
                          <span>Hình thức:</span>
                          {getType(item.tournamentTypeId)}
                          {getFeild(item.footballFieldTypeId)}
                        </p>
                        <p className="phonePlayer">
                          <span>Khu vực:</span>
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
                          Danh sách cầu thủ đăng ký
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
                Chưa tham gia giải đấu
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
                          <span>Tên giải:</span>
                          {item.tournamentName}
                        </p>
                        <p className="mailPlayer">
                          <span>Giải đấu:</span>
                          {getGender(item.tournamentGender)}
                        </p>
                        <p className="genderPlayer">
                          <span>Hình thức:</span>
                          {getType(item.tournamentTypeId)}
                          {getFeild(item.footballFieldTypeId)}
                        </p>
                        <p className="phonePlayer">
                          <span>Khu vực:</span>
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
                              value="Từ chối"
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
                              value="Đồng ý"
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
                Chưa có đội bóng đăng ký
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
              setHideShow={setHideShowDelete}
              hideShow={hideShowDelete}
            />
          </div>
        ) : null}
        {tourTeam.length !== 0 ? (
          <nav
            aria-label="Page navigation example"
            className={styles.pagingTournament1}
          >
            <ReactPaginate
              previousLabel={"Trang trước"}
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
