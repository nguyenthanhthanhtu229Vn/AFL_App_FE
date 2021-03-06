import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import "./styles/style.css";
import LoadingAction from "../LoadingComponent/LoadingAction";
import MyTeamInPlayer from "./MyTeamInPlayer";
import MyTournamentInPlayer from "./MyTournamentInPlayer";
import ScheduleInPlayer from "./ScheduleInPlayer";
import RequestInPlayer from "./RequestInPlayer";
import AchivementInPlayer from "./AchivementInPlayer";
import { TeamRegisterAPI, PlayerAcceptAPI } from "../../api/System";
import styles from "./styles/style.module.css";
import {
  getAllTeamByPlayerIdAPI,
  upDatePlayerInTeamAPI,
  deletePlayerInTeamAPI,
  checkPlayerInTeamAPI,
  addPlayerInTeamAPI,
} from "../../api/PlayerInTeamAPI";
import { getFootballPlayerById } from "../../api/FootballPlayer";
import { toast } from "react-toastify";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import axios from "axios";
import postNotifacation from "../../api/NotificationAPI";
function HeaderPlayerDetail() {
  const { idPlayer } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loadingAc, setLoadingAc] = useState(false);
  const [contentReport, setContentReport] = useState({ value: "", error: "" });
  const [contentCheckbox, setContentCheckbox] = useState({
    value: "",
    error: "",
  });
  const [popupReport, setPopupReport] = useState(false);
  const [activeTeamDetail, setActiveTeamDetail] = useState(location.pathname);
  const [detailPlayer, setDetailPlayer] = useState(null);
  const [allTeam, setAllTeam] = useState(null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusAdd, setStatusAdd] = useState(false);
  const [active, setActive] = useState("true");
  const [hideShow, setHideShow] = useState(false);
  useEffect(() => {
    getInForPlayerByID();
  }, [idPlayer]);
  const [statusPaticipate, setStatusPaticipate] = useState("Chi??u m??? c???u th???");
  useEffect(() => {
    getTeamByIdPlayer(active);
  }, [idPlayer, active, statusAdd === true, currentPage]);

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

  const getTeamByIdPlayer = (status) => {
    //setLoading(true);
    const response = getAllTeamByPlayerIdAPI(idPlayer, status, currentPage);
    response
      .then((res) => {
        //setLoading(false);
        setAllTeam(res.data.playerInTeamsFull);
        setCount(res.data.countList);
      })
      .catch((err) => {
        //setLoading(false);
        console.error(err);
      });
  };
  const deletePlayerInTeam = (id) => {
    if (id !== null) {
      setLoading(true);
      const response = deletePlayerInTeamAPI(id);
      response
        .then((res) => {
          if (res.status === 200) {
            setLoading(false);
            setHideShow(false);
            setStatusAdd(true);
            toast.success(
              `???? ${
                active === "true" ? " r???i kh???i " : " t??? ch???i "
              } ?????i b??ng th??nh c??ng`,
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
          setLoading(false);
          setHideShow(false);
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

  useEffect(() => {
    if (user != undefined) {
      checkPaticipateTeam();
    }
  }, []);
  const sendMailTeamRequest = (playerId, teamId) => {
    const response = TeamRegisterAPI(+playerId, teamId);
    response
      .then((res) => {
        if (res.status === 200) {
          postNotificationforTeamManager(+playerId, teamId, "teamManager")
        }
      })
      .catch((err) => {
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
  const addResquestToTeam = () => {
    setLoading(true);
    const data = {
      status: "Ch??? x??t duy???t t??? c???u th???",
      teamId: user.userVM.id,
      footballPlayerId: idPlayer,
    };
    const respone = addPlayerInTeamAPI(data);
    respone
      .then((res) => {
        if (res.status === 201) {
          sendMailTeamRequest(idPlayer, user.userVM.id);
        }
      })
      .catch((err) => {
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
  const checkPaticipateTeam = () => {
    const respone = checkPlayerInTeamAPI(user.userVM.id, idPlayer);
    respone
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.playerInTeamsFull.length > 0) {
            const playerInTeam = res.data.playerInTeamsFull[0];

            if (playerInTeam.status === "true") {
              setStatusPaticipate("???? tham gia ?????i b??ng");
            } else if (playerInTeam.status === "Ch??? x??t duy???t t??? ?????i b??ng") {
              setStatusPaticipate("Ch??? x??t duy???t t??? ?????i b??ng c???a b???n");
            } else setStatusPaticipate("Ch??? x??t duy???t t??? c???u th???");
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const postNotificationforTeamManager = async (playerId, teamId, type) => {
    const data = {
      content:
        type === "player"
          ? "C???u th??? ???? ?????ng ?? tham gia ?????i b??ng c???a b???n.Xem ngay"
          : "C?? ?????i b??ng mu???n chi??u m??? b???n v??? ?????i c???a h???.Xem ngay",
      userId: type === "player" ? teamId : playerId,
      tournamentId: 0,
      teamId: teamId,
    };
    try {
      const response = await postNotifacation(data);
      if (response.status === 201) {
        if (type === "player") {
          getTeamByIdPlayer(active);
          setLoading(false);
          toast.success("Ch???p nh???n ?????i b??ng th??nh c??ng", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          setStatusPaticipate("Ch??? x??t duy???t t??? c???u th???");
          toast.success(
            "Y??u c???u chi??u m??? c???u th??? th??nh c??ng.Ch??? ph???n h???i t??? c???u th??? nh??!",
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
          setLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  const sendMailPlayerAccept = (playerId, teamId) => {
    
    const response = PlayerAcceptAPI(+playerId, teamId);
    response
      .then((res) => {
        if (res.status === 200) {
          //setStatusAdd(true);
          postNotificationforTeamManager(+playerId, teamId, "player");
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
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
  const updateStatusFootballPlayer = (id, status, idTeam) => {
    setLoading(true);
    const response = upDatePlayerInTeamAPI(id, status);
    response
      .then((res) => {
        if (res.status === 200) {
          sendMailPlayerAccept(idPlayer, idTeam);
        }
      })
      .then((err) => {
        console.error(err);
        //setLoading(false);
        // toast.error(err.response.data.message, {
        //   position: "top-right",
        //   autoClose: 3000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        // });
      });
  };

  const getInForPlayerByID = () => {
    setLoading(true);
    const response = getFootballPlayerById(idPlayer);
    response
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);

          setDetailPlayer(res.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  // render by link
  const renderByLink = () => {
    if (activeTeamDetail === `/playerDetail/${idPlayer}/myTeamInPlayer`) {
      return (
        <MyTeamInPlayer
          active={active}
          setactive={setActive}
          allTeam={allTeam}
          count={count}
          setCurrentPage={setCurrentPage}
          hideShow={hideShow}
          setHideShow={setHideShow}
          deletePlayerInTeam={deletePlayerInTeam}
          setStatusAdd={setStatusAdd}
          currentPage={currentPage}
          user={user}
        />
      );
    }
    if (activeTeamDetail === `/playerDetail/${idPlayer}/myTournamentInPlayer`) {
      return <MyTournamentInPlayer />;
    }
    if (activeTeamDetail === `/playerDetail/${idPlayer}/scheduleInPlayer`) {
      return <ScheduleInPlayer />;
    }
    if (activeTeamDetail === `/playerDetail/${idPlayer}/requestInPlayer`) {
      return (
        <RequestInPlayer
          deletePlayerInTeam={deletePlayerInTeam}
          updateStatusFootballPlayer={updateStatusFootballPlayer}
          hideShow={hideShow}
          setHideShow={setHideShow}
          setStatusAdd={setStatusAdd}
          user={user}
          allTeam={allTeam}
          active={active}
          setactive={setActive}
          count={count}
          setCurrentPage={setCurrentPage}
        />
      );
    }
    if (activeTeamDetail === `/playerDetail/${idPlayer}/achivementInPlayer`) {
      return <AchivementInPlayer />;
    }
  };

  const changePositionByVNese = (data) => {
    if (data === "goalkeeper") return "Th??? m??n";
    else if (data === "defender") return "H???u v???";
    else if (data === "midfielder") return "Ti???n v???";
    else return "Ti???n ?????o";
  };

  const validateForm = (name, value) => {
    switch (name) {
      case "contentU":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Kh??ng ???????c ????? tr???ng",
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
      case "radio-group":
        let contentRadio = null;
        if (flagValid.flag === false) {
          contentRadio = {
            value,
            error: flagValid.content,
          };
        } else {
          contentRadio = {
            value,
            error: null,
          };
        }
        setContentCheckbox({
          ...contentRadio,
        });
        setContentReport({ value: "", error: "" });
        break;
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
    if (
      (contentReport.value === null && contentCheckbox.value === null) ||
      (contentReport.value === "" && contentCheckbox.value === "") ||
      (contentReport.value === "" && contentCheckbox.value === "Ly?? do kha??c")
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
      setLoadingAc(false);
      return;
    }
    const data = {
      reason:
        contentReport.value !== ""
          ? contentReport.value
          : contentCheckbox.value,
      userId: user.userVM.id,
      footballPlayerId: idPlayer,
      status: "Ch??a duy???t",
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
        toast.success("Ba??o ca??o tha??nh c??ng", {
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
  };

  return (
    <>
      <ScrollToTop />
      <Header id={idPlayer} />
      <div className="teamdetail">
        {detailPlayer !== null ? (
          <div>
            <div className="HeaderTeamDetail">
              <div className="info__manager player_detail ">
                <div>
                  <div className="avt__Team">
                    <img src={detailPlayer.playerAvatar} alt="a" />
                  </div>
                  {user !== null &&
                  detailPlayer !== null &&
                  user.userVM.id === detailPlayer.id ? (
                    <Link
                      to={`/updatePlayer/${detailPlayer.id}`}
                      //state={{ address: team.teamArea }}
                      className="editTeamTest"
                    >
                      <i class="fa-solid fa-pen-to-square"></i>Chi??nh s????a th??ng
                      tin
                    </Link>
                  ) : user !== null && user.teamInFo !== null ? (
                    <button
                      onClick={() => {
                        if (statusPaticipate === "Chi??u m??? c???u th???") {
                          addResquestToTeam();
                        }
                      }}
                      className="editTeamTest"
                      style={{
                        cursor:
                          statusPaticipate === "Chi??u m??? c???u th???"
                            ? "pointer"
                            : "default",
                        hover: {
                          backgroundColor:
                            statusPaticipate === "Chi??u m??? c???u th???"
                              ? "#16192b"
                              : "#d7fc6a",
                          color:
                            statusPaticipate === "Chi??u m??? c???u th???"
                              ? "#ffffff"
                              : "black",
                        },
                      }}
                    >
                      {statusPaticipate}
                    </button>
                  ) : null}
                </div>

                <div className="headertext__team">
                  <h2></h2>
                  <div className="man name__manager">
                    <i className="fas fa-light fa-user"></i>
                    <span className="title">Ho?? va?? t??n: </span>
                    <span>{detailPlayer.playerName}</span>
                  </div>
                  <div className="man phone__manager">
                    <i>
                      <img src="/assets/icons/telephone.png" alt="tp" />
                    </i>
                    <span className="title">S???? ??i????n thoa??i: </span>
                    <span>{detailPlayer.userVM.phone}</span>
                  </div>
                  <div className="man email__manager">
                    <i>
                      <img src="/assets/icons/mail-icon.svg" alt="mail" />
                    </i>
                    <span className="title">Email: </span>
                    <span>{detailPlayer.userVM.email}</span>
                  </div>
                  <div className="man member__manager">
                    <i>
                      <img src="/assets/icons/join.png" alt="join" />
                    </i>
                    <span className="title">Vi?? tri?? thi ??????u: </span>
                    <span>{changePositionByVNese(detailPlayer.position)}</span>
                  </div>
                  <div className="man gender__manager">
                    <i className="fa-solid fa-calendar-days"></i>
                    <span className="title">Nga??y sinh: </span>
                    <span>
                      {detailPlayer.userVM.dateOfBirth !== null
                        ? formatDate(
                            detailPlayer.userVM.dateOfBirth.split(" ")[0]
                          )
                        : null}
                      {/* {detailPlayer.userVM.dateOfBirth !== null
                        ? detailPlayer.userVM.dateOfBirth
                            .split("-")[2]
                            .split("T")[0] +
                          "/" +
                          detailPlayer.userVM.dateOfBirth.split("-")[1] +
                          "/" +
                          detailPlayer.userVM.dateOfBirth.split("-")[0]
                        : null} */}
                    </span>
                  </div>
                  <div className="man gender__manager location">
                    <i className="fas fa-solid fa-location-dot"></i>
                    <span className="title">??i??a chi??: </span>
                    <span className="text_field">
                      {detailPlayer.userVM.address}
                    </span>
                  </div>
                  <div className="man gender__manager">
                    <i className="fas fa-solid fa-font-awesome"></i>
                    <span className="title">M?? ta?? ba??n th??n: </span>
                    <span>{detailPlayer.description}</span>
                  </div>
                </div>
                {user !== null && user.userVM.id !== detailPlayer.id ? (
                  <>
                    <div
                      className="report"
                      onClick={() => setPopupReport(true)}
                    >
                      <i class="fa-solid fa-exclamation"></i>
                      <p>Ba??o ca??o</p>
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
                        onClick={() => setPopupReport(false)}
                      >
                        X
                      </div>
                      <h4>Ba??o ca??o c????u thu??</h4>
                      <div className={styles.checkbox}>
                        <p>
                          <input
                            type="radio"
                            id="test1"
                            name="radio-group"
                            value={"C????u thu?? gia?? ma??o"}
                            onChange={onChangeHandler}
                          />
                          <label htmlFor="test1">C????u thu?? gia?? ma??o</label>
                        </p>
                        <p>
                          <input
                            type="radio"
                            id="test2"
                            name="radio-group"
                            value={"T??n c????u thu?? kh??ng h????p l????"}
                            onChange={onChangeHandler}
                          />
                          <label htmlFor="test2">
                            T??n c????u thu?? kh??ng h????p l????
                          </label>
                        </p>
                        <p>
                          <input
                            type="radio"
                            id="test3"
                            name="radio-group"
                            value={"Qu????y r????i, b????t na??t"}
                            onChange={onChangeHandler}
                          />
                          <label htmlFor="test3">Qu????y r????i, b????t na??t</label>
                        </p>
                        <p>
                          <input
                            type="radio"
                            id="test4"
                            name="radio-group"
                            value={"N????i dung kh??ng phu?? h????p"}
                            onChange={onChangeHandler}
                          />
                          <label htmlFor="test4">N????i dung kh??ng phu?? h????p</label>
                        </p>
                        <p>
                          <input
                            type="radio"
                            id="test5"
                            name="radio-group"
                            value={"Ly?? do kha??c"}
                            onChange={onChangeHandler}
                          />
                          <label htmlFor="test5">Ly?? do kha??c:</label>
                        </p>
                      </div>
                      <p className="error errRp">{contentReport.error}</p>
                      {contentCheckbox.value === "Ly?? do kha??c" ? (
                        <textarea
                          placeholder="Ly?? do ba??o ca??o c????u thu?? na??y"
                          className="content"
                          name="contentU"
                          autoComplete="off"
                          value={contentReport.value}
                          onChange={onChangeHandler}
                        />
                      ) : null}
                      <button>Ba??o ca??o</button>
                    </form>
                  </>
                ) : null}
              </div>
              <div className="headerteamdetail__tag headertour__tag">
                <Link
                  to={`/playerDetail/${idPlayer}/myTeamInPlayer`}
                  className={
                    activeTeamDetail ===
                    `/playerDetail/${idPlayer}/myTeamInPlayer`
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTeamDetail(
                      `/playerDetail/${idPlayer}/myTeamInPlayer`
                    )
                  }
                >
                  ??????i bo??ng tham gia
                </Link>
                <Link
                  to={`/playerDetail/${idPlayer}/myTournamentInPlayer`}
                  className={
                    activeTeamDetail ===
                    `/playerDetail/${idPlayer}/myTournamentInPlayer`
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTeamDetail(
                      `/playerDetail/${idPlayer}/myTournamentInPlayer`
                    )
                  }
                >
                  Gia??i ??????u tham gia
                </Link>
                <Link
                  to={`/playerDetail/${idPlayer}/requestInPlayer`}
                  className={
                    activeTeamDetail ===
                    `/playerDetail/${idPlayer}/requestInPlayer`
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTeamDetail(
                      `/playerDetail/${idPlayer}/requestInPlayer`
                    )
                  }
                >
                  Y??u c????u tham gia
                </Link>
                <Link
                  to={`/playerDetail/${idPlayer}/scheduleInPlayer`}
                  className={
                    activeTeamDetail ===
                    `/playerDetail/${idPlayer}/scheduleInPlayer`
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTeamDetail(
                      `/playerDetail/${idPlayer}/scheduleInPlayer`
                    )
                  }
                >
                  Li??ch thi ??????u
                </Link>
                <Link
                  to={`/playerDetail/${idPlayer}/achivementInPlayer`}
                  className={
                    activeTeamDetail ===
                    `/playerDetail/${idPlayer}/achivementInPlayer`
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTeamDetail(
                      `/playerDetail/${idPlayer}/achivementInPlayer`
                    )
                  }
                >
                  Tha??nh ti??ch
                </Link>
              </div>
            </div>
            {renderByLink()}
          </div>
        ) : (
          <p className="createPlayermore">
            {" "}
            Ba??n ch??a pha??i la?? c????u thu??
            <Link to="/createPlayer" className="createnow">
              {`-> `}Tr???? tha??nh c????u thu?? ngay
            </Link>
          </p>
        )}
      </div>
      {loading ? <LoadingAction /> : null}
      <Footer />
    </>
  );
}

export default HeaderPlayerDetail;
