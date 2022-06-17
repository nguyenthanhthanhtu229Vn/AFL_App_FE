import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./styles/style.css";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import GalleryTournamentDetail from "./GalleryTournamentDetail";
import InforTournamentDetail from "./InforTournamentDetail";
import ScheduleTournamentDetail from "./ScheduleTournamentDetail";
import RankTableTournamentDetail from "./RankTableTournamentDetail";
import TeamInTournament from "./TeamInTournament";
import PredictionTournamentDetail from "./PredictionTournamentDetail";
import CommentTournamentDetail from "./CommentTournamentDetail";
import Loading from "../LoadingComponent/Loading";
import LoadingAction from "../LoadingComponent/LoadingAction";
import NewsTournamentDetail from "./NewsTournamentDetail";
import { getAPI } from "../../api";
import { useNavigate } from "react-router-dom";
import RegisterInTournament from "./RegisterInTournament";
import { getTeamByIdAPI } from "../../api/TeamAPI";
import {
  getTeamInTournamentByTourIdAPI,
  updateStatusTeamInTournament,
  deleteRegisterTeamAPI,
  updateTeamInScheduleAPI,
  getTeamPaticaipateInTourByTourIDAPI,
} from "../../api/TeamInTournamentAPI";
import {
  deletePlayerInTournamentById,
  getAllPlayerInTournamentByTeamInTournamentIdAPI,
} from "../../api/PlayerInTournamentAPI";
import { toast } from "react-toastify";
import { getUserByIdAPI } from "../../api/User";
import CountDown from "./CountDown";
function HeaderTournamentDetail() {
  const now = new Date().getTime();
  const { idTour } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [hideShowDelete, setHideShowDelete] = useState(false);
  const [hideShow, setHideShow] = useState(false);
  const [checkRegisterTour, setCheckRegistertour] = useState(false);
  const [checkPaticipate, setCheckPaticipate] = useState(false);
  const [statusTeamInTour, setStatusInTour] = useState("Tham gia");
  const [activeTeamDetail, setActiveTeamDetail] = useState(location.pathname);
  const [tourDetail, setTourDetail] = useState("");
  const [host, setHost] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingAc, setLoadingAc] = useState(false);
  const [popupReport, setPopupReport] = useState(false);
  const [contentReport, setContentReport] = useState({ value: "", error: "" });
  let navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [allTeam, setAllTeam] = useState(null);
  const [typeReport, setTypeReport] = useState("report");
  // Get Tour Detail

  const getTourDetail = async () => {
    let afterDefaultURL = `tournaments/${idTour}`;
    let response = getAPI(afterDefaultURL);
    response
      .then((res) => {
        setTourDetail(res.data);
        getUserById(res.data.userId);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };
  //Get User
  const getUserById = async (id) => {
    let afterDefaultURL = `users/${id}`;
    let response = getAPI(afterDefaultURL);
    response
      .then((res) => {
        setHost(res.data);
      })
      .catch((err) => console.error(err));
  };

  // Get Type
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

  // Get Feild
  const getFeild = (id) => {
    if (1 === id) {
      return "| Sân 5";
    }
    if (2 === id) {
      return "| Sân 7";
    }
    if (3 === id) {
      return "| Sân 11";
    } else {
      return "";
    }
  };

  // format Date
  const formatDate = (date) => {
    const day = new Date(date);
    return (
      String(day.getDate()).padStart(2, "0") +
      "/" +
      String(day.getMonth() + 1).padStart(2, "0") +
      "/" +
      day.getFullYear()
    );
  };

  // render by link
  const renderByLink = () => {
    if (
      activeTeamDetail === `/tournamentDetail/${idTour}/inforTournamentDetail`
    ) {
      return <InforTournamentDetail tourDetail={tourDetail} />;
    }
    if (
      activeTeamDetail === `/tournamentDetail/${idTour}/galleryTournamentDetail`
    ) {
      return <GalleryTournamentDetail idTour={tourDetail.userId} />;
    }
    if (
      activeTeamDetail ===
      `/tournamentDetail/${idTour}/scheduleTournamentDetail`
    ) {
      return (
        <ScheduleTournamentDetail
          tournamentType={
            tourDetail.tournamentTypeId === 1
              ? "KnockoutStage"
              : tourDetail.tournamentTypeId === 2
              ? "CircleStage"
              : "GroupStage"
          }
          tourDetailId={tourDetail.id}
          hostTournamentId={tourDetail.userId}
          groupNumber={tourDetail.groupNumber}
          startDate={tourDetail.tournamentStartDate}
          endDate={tourDetail.tournamentEndDate}
          user={user != undefined ? user : undefined}
        />
      );
    }
    if (
      activeTeamDetail ===
      `/tournamentDetail/${idTour}/rankTableTournamentDetail`
    ) {
      return <RankTableTournamentDetail />;
    }
    if (activeTeamDetail === `/tournamentDetail/${idTour}/teamInTournament`) {
      return (
        <TeamInTournament
          user={user != undefined ? user : undefined}
          acceptTeamInTournament={acceptTeamInTournament}
          setStatusTeam={setStatusTeam}
          hostTournamentId={tourDetail.userId}
          allTeam={allTeam}
          loadingAc={loadingAc}
          hideShow={hideShowDelete}
          setHideShow={setHideShowDelete}
          getAllPlayerInTournamentByIdTeam={getAllPlayerInTournamentByIdTeam}
        />
      );
    }
    if (
      activeTeamDetail ===
      `/tournamentDetail/${idTour}/predictionTournamentDetail`
    ) {
      return <PredictionTournamentDetail />;
    }
    if (
      activeTeamDetail === `/tournamentDetail/${idTour}/commentTournamentDetail`
    ) {
      return <CommentTournamentDetail />;
    }
    if (
      activeTeamDetail === `/tournamentDetail/${idTour}/newsTournamentDetail`
    ) {
      return <NewsTournamentDetail idTour={tourDetail.userId} />;
    }
  };

  useEffect(() => {
    setActiveTeamDetail(location.pathname);
    getTourDetail();
  }, [location.pathname]);

  useEffect(() => {
    if (tourDetail.id != undefined) {
      getAllTeamInTournamentByTourId();
    }
  }, [tourDetail.id, statusTeamInTour]);

  const getInForManagerById = async (id) => {
    const response = await getUserByIdAPI(id);
    if (response.status === 200) {
      return response.data;
    }
  };

  useEffect(() => {
    if (user != undefined) {
      checkTeamPaticipate();
    }
  }, [checkRegisterTour]);
  const checkTeamPaticipate = async () => {
    setLoadingAc(true);
    try {
      const response = await getTeamInTournamentByTourIdAPI(
        idTour,
        "",
        currentPage,
        user.userVM.id
      );
      //console.log(response.data);
      if (response.data.teamInTournaments.length > 0) {
        setCheckPaticipate(response.data.teamInTournaments[0].status);
      }
      setLoadingAc(false);
    } catch (err) {
      setLoadingAc(false);
      console.error(err);
    }
  };
  // const updateClick = (data,addressTour) => {
  //   navigate(`update-tournament-detail`,{state: {id: data,address:addressTour} })
  // }

  const getAllPlayerInTournamentByIdTeam = (idTeam) => {
    setLoadingAc(true);
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
        setLoadingAc(false);
        setHideShowDelete(false);
        console.error(err);
      });
  };
  const deletePlayerById = async (id) => {
    try {
      const response = await deletePlayerInTournamentById(id);
    } catch (err) {
      setLoadingAc(false);
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

  const deleteTeamInTournament = (id) => {
    const response = deleteRegisterTeamAPI(id);
    response
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setHideShowDelete(false);
          setLoadingAc(false);
          setTypeReport('report');
          getAllTeamInTournamentByTourId();
          toast.success(
            typeReport !== "outtournament"
              ? "Từ chối đội bóng thành công"
              : "Đội bóng đã hủy tham gia giải thành công",
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
        setHideShowDelete(false);
        setLoadingAc(false);
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
  const addTeamInSchedule = (idTeamInTour) => {
    const data = {
      teamInTournamentId: idTeamInTour,
    };
    const response = updateTeamInScheduleAPI(data);
    response
      .then((res) => {
        if (res.status === 200) {
          setHideShowDelete(false);
          getAllTeamInTournamentByTourId();
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
        ...teamInTournament.teamInTournament,
        status: status ? "Tham gia" : "Từ chối",
      };
      setLoadingAc(true);
      console.log(teamInTournament);
      const response = updateStatusTeamInTournament(data);
      response
        .then((res) => {
          if (res.status === 201) {
            getTourDetail();
            addTeamInSchedule(teamInTournament.teamInTournament.id);
          }
        })
        .catch((err) => {
          setHideShowDelete(false);
          setLoadingAc(false);
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

  const getAllTeamInTournamentByTourId = async () => {
    setLoadingAc(true);
    try {
      const response = await getTeamInTournamentByTourIdAPI(
        idTour,
        statusTeamInTour,
        currentPage,
        ""
      );

      const data = response.data.teamInTournaments;
      const teams = data.map(async (team) => {
        const teamResponse = await getTeamByID(team.teamId);
        const user = await getInForManagerById(team.teamId);
        teamResponse.teamInTournament = team;
        teamResponse.user = user;
        return teamResponse;
      });
      const teamData = await Promise.all(teams);
      teamData.countList = response.data.countList;
      setLoadingAc(false);
      console.log(teamData);
      setAllTeam(teamData);
    } catch (err) {
      setLoadingAc(false);
      console.error(err);
    }
  };

  const getTeamByID = async (idTeam) => {
    const response = await getTeamByIdAPI(idTeam);
    return response.data;
  };
  const setStatusTeam = (data) => {
    setStatusInTour(data);
  };

  const validateForm = (name, value) => {
    switch (name) {
      case "contentU":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Không được để trống",
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
      case "contentU":
        let contentU = null;
        if (flagValid.flag === false) {
          contentU = {
            value,
            error: flagValid.content,
          };
        } else {
          contentU = {
            value,
            error: null,
          };
        }
        setContentReport({
          ...contentU,
        });
        break;
      default:
        break;
    }
  };

  const sendReport = async (e) => {
    setLoadingAc(true);
    e.preventDefault();
    if (contentReport.value === null || contentReport.value === "") {
      toast.error("Không được để trống", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoadingAc(false);
      return;
    }
    if (typeReport === "report") {
      const data = {
        reason: contentReport.value,
        userId: user.userVM.id,
        tournamentId: idTour,
      };
      try {
        const response = await axios.post(
          "https://afootballleague.ddns.net/api/v1/reports",
          data
        );
        if (response.status === 201) {
          setPopupReport(false);
          setContentReport({ value: "", error: "" });
          setLoadingAc(false);
          toast.success("Báo cáo thành công", {
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
        setLoadingAc(false);
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
    } else {
      getAllPlayerInTournamentByIdTeam(user.userVM.id);
    }
  };

  const checkTeamInTour = () => {
    if (user !== undefined && tourDetail.id !== undefined) {
      const response = getTeamPaticaipateInTourByTourIDAPI(tourDetail.id);
      response
        .then((res) => {
          if (res.status === 200) {
            const teamPaticipate = res.data.teamInTournaments;
            const findTeam = teamPaticipate.find(
              (item) => item.teamId === user.userVM.id
            );
            if (findTeam.id !== undefined) {
              return true;
            } else {
              return false;
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      return false;
    }
  };
  return (
    <>
      <Header id={idTour} />
      {loadingAc ? <LoadingAction /> : null}
      <div className="teamdetail">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <div className="HeaderTeamDetail">
              <div className="info__manager infor_tourdetail">
                <div>
                  <div className="avt__Team">
                    <img
                      src={tourDetail.tournamentAvatar}
                      alt={tourDetail.tournamentName}
                    />
                  </div>
                  {user !== null &&
                  tourDetail != null &&
                  user.userVM.roleId !== 1 ? (
                    <>
                      {user.userVM.id === tourDetail.userId ? (
                        <Link
                          to={`/tournamentDetail/${tourDetail.id}/inforTournamentDetail/update-tournament-detail`}
                          state={{
                            id: tourDetail.id,
                            address: tourDetail.footballFieldAddress,
                            lengthTeamPaticipate:
                              tourDetail.numberTeamInTournament,
                          }}
                          className="btn_UpdateTournament"
                          style={{
                            padding: "20px 50px",
                            marginLeft: 75,
                            fontWeight: 600,
                            fontFamily: "Mulish-Bold",
                            borderRadius: 5,
                            backgroundColor: "#D7FC6A",
                            border: 1,
                            borderColor: "#D7FC6A",
                            transition: "0.5s",
                            position: "absolute",
                            top: 365,
                          }}
                          // onClick={() => {
                          //   updateClick(,)
                          // }}
                        >
                          {" "}
                          <i class="fa-solid fa-pen-to-square" />
                          Chỉnh sửa giải đấu
                        </Link>
                      ) : tourDetail.mode !== "PRIVATE" &&
                        new Date().getTime() <=
                          new Date(tourDetail.registerEndDate).getTime() &&
                        checkPaticipate === false &&
                        user.teamInfo !== null ? (
                        <div>
                          <div
                            className={hideShow ? "overlay active" : "overlay"}
                          ></div>
                          <button
                            className="btn_UpdateTournament"
                            style={{
                              padding: "20px 50px",
                              marginLeft: 75,
                              fontWeight: 600,
                              fontFamily: "Mulish-Bold",
                              borderRadius: 5,
                              backgroundColor: "#D7FC6A",
                              border: 1,
                              borderColor: "#D7FC6A",
                              transition: "0.5s",
                              position: "absolute",
                              top: 365,
                            }}
                            onClick={() => {
                              setHideShow(true);
                            }}
                          >
                            Tham gia giải đấu
                          </button>
                          <RegisterInTournament
                            tourDetail={tourDetail}
                            setCheckRegistertour={setCheckRegistertour}
                            hideShow={hideShow}
                            setHideShow={setHideShow}
                            idUser={
                              user != undefined ? user.userVM.id : undefined
                            }
                          />
                        </div>
                      ) : checkPaticipate === "Tham gia" ? (
                        <button
                          style={{
                            padding: "20px 50px",
                            marginLeft: 75,
                            fontWeight: 600,
                            fontFamily: "Mulish-Bold",
                            borderRadius: 5,
                            backgroundColor: "#D7FC6A",
                            border: 1,
                            borderColor: "#D7FC6A",
                            transition: "0.5s",
                            position: "absolute",
                            top: 365,
                            cursor: "default",
                          }}
                          // onClick={() => {
                          //   updateClick(,)
                          // }}
                        >
                          Đã tham gia giải đấu
                        </button>
                      ) : tourDetail.mode !== "PRIVATE" &&
                        checkPaticipate === "Chờ duyệt" ? (
                        <button
                          style={{
                            padding: "20px 50px",
                            marginLeft: 75,
                            fontWeight: 600,
                            fontFamily: "Mulish-Bold",
                            borderRadius: 5,
                            backgroundColor: "#D7FC6A",
                            border: 1,
                            borderColor: "#D7FC6A",
                            transition: "0.5s",
                            position: "absolute",
                            top: 365,
                            cursor: "default",
                          }}
                          // onClick={() => {
                          //   updateClick(,)
                          // }}
                        >
                          Đang chờ xét duyệt
                        </button>
                      ) : null}
                    </>
                  ) : null}
                </div>

                <div className="headertext__team">
                  <h2>{tourDetail.tournamentName}</h2>
                  <div className="man name__manager">
                    <i class="fa-solid fa-bullhorn"></i>
                    <span className="title">Chế độ: </span>
                    <span>
                      {tourDetail.mode === "PRIVATE" ? "Riêng tư" : "Công khai"}
                    </span>
                  </div>
                  <div className="man name__manager">
                    <i className="fas fa-light fa-user"></i>
                    <span className="title">Người tổ chức: </span>
                    <span>{host.username}</span>
                  </div>
                  <div className="man phone__manager">
                    <i>
                      <img src="/assets/icons/telephone.png" alt="tp" />
                    </i>
                    <span className="title">Số điện thoại: </span>
                    <span>{tourDetail.tournamentPhone}</span>
                  </div>
                  <div className="man email__manager">
                    <i>
                      <img src="/assets/icons/mail-icon.svg" alt="mail" />
                    </i>
                    <span className="title">Email: </span>
                    <span>{host.email}</span>
                  </div>
                  <div className="man member__manager">
                    <i>
                      <img src="/assets/icons/join.png" alt="join" />
                    </i>
                    <span className="title">Đội tham gia: </span>
                    <span>
                      {tourDetail.numberTeamInTournament} /{" "}
                      {tourDetail.footballTeamNumber} đội
                    </span>
                  </div>
                  <div className="man gender__manager">
                    <i className="fas fa-solid fa-font-awesome"></i>
                    <span className="title">Hình thức: </span>
                    <span>
                      {getType(tourDetail.tournamentTypeId)}{" "}
                      {getFeild(tourDetail.footballFieldTypeId)}
                    </span>
                  </div>
                  <div className="man gender__manager location">
                    <i className="fas fa-solid fa-location-dot"></i>
                    <span className="title">Địa điểm: </span>
                    <span className="text_field">
                      {tourDetail.footballFieldAddress}
                    </span>
                  </div>
                  <div className="man gender__manager">
                    <i className="fa-solid fa-calendar-days"></i>
                    <span className="title">Thời gian diễn ra: </span>
                    <span>
                      {formatDate(tourDetail.tournamentStartDate)} -{" "}
                      {formatDate(tourDetail.tournamentEndDate)}{" "}
                    </span>
                  </div>
                </div>

                {user !== null && checkTeamInTour ? (
                  <div
                    className="report"
                    onClick={() => {
                      setPopupReport(true);
                      setTypeReport("outtournament");
                    }}
                  >
                    <p>Rời giải đấu</p>
                  </div>
                ) : null}

                {user !== null && user.userVM.id !== tourDetail.userId ? (
                  <>
                    <div
                      style={{
                        top: checkTeamInTour ? 70 : 40,
                      }}
                      className="report"
                      onClick={() => {
                        setPopupReport(true);
                        setTypeReport("report");
                      }}
                    >
                      <i class="fa-solid fa-exclamation"></i>
                      <p>Báo cáo</p>
                    </div>

                    <div
                      className={popupReport ? `overlay active` : "active"}
                      onClick={() => {
                        setPopupReport(false);
                      }}
                    ></div>
                    <form
                      className={
                        popupReport ? "popup__news active" : "popup__news"
                      }
                      onSubmit={sendReport}
                    >
                      <div
                        className="close"
                        onClick={() => {
                          setPopupReport(false);
                          if(typeReport === "outtournament"){
                            setTypeReport("report")
                          }

                        }}
                      >
                        X
                      </div>
                      <h4>
                        {" "}
                        {typeReport === "report"
                          ? "Báo cáo giải đấu"
                          : "Rời khỏi giải đấu"}
                      </h4>
                      <p className="error errRp">{contentReport.error}</p>
                      <textarea
                        placeholder={
                          typeReport === "report"
                            ? "Lý do báo cáo giải đấu này"
                            : "Lý do rời khỏi giải đấu này"
                        }
                        className="content"
                        name="contentU"
                        autoComplete="off"
                        value={contentReport.value}
                        onChange={onChangeHandler}
                      />
                      <button>
                        {typeReport === "report" ? "Báo cáo" : "Rời giải"}
                      </button>
                    </form>
                  </>
                ) : null}
              </div>
              {tourDetail.registerEndDate !== null ? (
                <CountDown registerEndDate={tourDetail.registerEndDate} />
              ) : null}
              <div className="headerteamdetail__tag headertour__tag">
                <Link
                  to={`/tournamentDetail/${idTour}/inforTournamentDetail`}
                  className={
                    activeTeamDetail ===
                    `/tournamentDetail/${idTour}/inforTournamentDetail`
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTeamDetail(
                      `/tournamentDetail/${idTour}/inforTournamentDetail`
                    )
                  }
                >
                  Thông tin
                </Link>
                <Link
                  to={`/tournamentDetail/${idTour}/newsTournamentDetail`}
                  className={
                    activeTeamDetail ===
                    `/tournamentDetail/${idTour}/newsTournamentDetail`
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTeamDetail(
                      `/tournamentDetail/${idTour}/newsTournamentDetail`
                    )
                  }
                >
                  Tin tức
                </Link>
                <Link
                  to={`/tournamentDetail/${idTour}/galleryTournamentDetail`}
                  className={
                    activeTeamDetail ===
                    `/tournamentDetail/${idTour}/galleryTournamentDetail`
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTeamDetail(
                      `/tournamentDetail/${idTour}/galleryTournamentDetail`
                    )
                  }
                >
                  Hình ảnh
                </Link>
                <Link
                  to={`/tournamentDetail/${idTour}/scheduleTournamentDetail`}
                  className={
                    activeTeamDetail ===
                    `/tournamentDetail/${idTour}/scheduleTournamentDetail`
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTeamDetail(
                      `/tournamentDetail/${idTour}/scheduleTournamentDetail`
                    )
                  }
                >
                  Lịch thi đấu
                </Link>
                <Link
                  to={`/tournamentDetail/${idTour}/rankTableTournamentDetail`}
                  className={
                    activeTeamDetail ===
                    `/tournamentDetail/${idTour}/rankTableTournamentDetail`
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTeamDetail(
                      `/tournamentDetail/${idTour}/rankTableTournamentDetail`
                    )
                  }
                >
                  Bảng xếp hạng
                </Link>
                <Link
                  to={`/tournamentDetail/${idTour}/teamInTournament`}
                  className={
                    activeTeamDetail ===
                    `/tournamentDetail/${idTour}/teamInTournament`
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTeamDetail(
                      `/tournamentDetail/${idTour}/teamInTournament`
                    )
                  }
                >
                  Đội bóng
                </Link>
                <Link
                  to={`/tournamentDetail/${idTour}/predictionTournamentDetail`}
                  className={
                    activeTeamDetail ===
                    `/tournamentDetail/${idTour}/predictionTournamentDetail`
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTeamDetail(
                      `/tournamentDetail/${idTour}/predictionTournamentDetail`
                    )
                  }
                >
                  Dự đoán
                </Link>
                <Link
                  to={`/tournamentDetail/${idTour}/commentTournamentDetail`}
                  className={
                    activeTeamDetail ===
                    `/tournamentDetail/${idTour}/commentTournamentDetail`
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTeamDetail(
                      `/tournamentDetail/${idTour}/commentTournamentDetail`
                    )
                  }
                >
                  Bình luận
                </Link>
              </div>
            </div>
            {renderByLink()}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default HeaderTournamentDetail;
