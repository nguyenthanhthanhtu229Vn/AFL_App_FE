import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles/style.css";
// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
import app from "../../firebase/firebase";
import { getAPI } from "../../api";
import Notification from "../NotificationComponent/Notification";
import axios from "axios";
import { toast } from "react-toastify";
function Header(id) {
  // const firebaseConfig = {
  //   apiKey: "AIzaSyCYXpUYy_KK1FjtBjz19gY2QTWi4sBcsgU",
  //   authDomain: "amateurfoooballleague.firebaseapp.com",
  //   databaseURL: "gs://amateurfoooballleague.appspot.com",
  //   projectId: "amateurfoooballleague",
  //   storageBucket: "amateurfoooballleague.appspot.com",
  //   messagingSenderId: "765175452190",
  //   appId: "1:765175452190:web:3e01517d116d4777c9140f",
  //   measurementId: "G-7Z7LB0W52J",
  // };

  // !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
  // get Locoal Storage
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  // const [team, setTeam] = useState(
  //   JSON.parse(localStorage.getItem("teamInfo"))
  // );
  // const [player, setPlayer] = useState(
  //   JSON.parse(localStorage.getItem("playerInfo"))
  // );
  // signout


  const logout = async () => {
    try {
      const res = await axios.post(
        "https://afootballleague.ddns.net/api/v1/auth/logout",
        {
          token: localStorage.getItem("token_subcribe"),
          email: user.userVM.email,
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message, {
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
      console.log(error);
    }
  };
  const signout = () => {
    logout();
    app.auth().signOut();
    localStorage.removeItem("userInfo");
    localStorage.removeItem("teamInfo");
    localStorage.removeItem("playerInfo");
    localStorage.removeItem("token_subcribe");
    window.location.reload();
  };
  const [myAccount, setMyAccount] = useState([]);
  const getMyAccount = () => {
    const afterURL = `users/${user ? user.userVM.id : ""}`;
    const response = getAPI(afterURL);
    response
      .then((res) => {
        setMyAccount(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const location = useLocation();
  const [clickMenu, setClickMenu] = useState(false);
  const [activeMenu, setactiveMenu] = useState(location.pathname);
  const [clickUserMenu, setClickUserMenu] = useState(false);
  const tourHighlight = [
    "/findTournaments",
    "/createTournament",
    "/tournamentDetail",
    `/tournamentDetail/${id.id}/inforTournamentDetail`,
    `/tournamentDetail/${id.id}/galleryTournamentDetail`,
    `/tournamentDetail/${id.id}/scheduleTournamentDetail`,
    `/tournamentDetail/${id.id}/rankTableTournamentDetail`,
    `/tournamentDetail/${id.id}/teamInTournament`,
    `/tournamentDetail/${id.id}/commentTournamentDetail`,
    `/tournamentDetail/${id.id}/predictionTournamentDetail`,
    `/tournamentDetail/${id.id}/newsTournamentDetail`,
  ];
  const teamHighlight = [
    "/findTeam",
    "/createTeam",
    `/teamDetail/${id.id}/inforTeamDetail`,
    `/teamDetail/${id.id}/listPlayer`,
    `/teamDetail/${id.id}/reportTeamDeatail`,
    `/teamDetail/${id.id}/commentTeamDetail`,
    `/teamDetail/${id.id}/tournamentTeamDetail`,
  ];

  const playerHighlight = [
    "/footballPlayer",
    `/playerDetail/${id.id}/myTeamInPlayer`,
    `/playerDetail/${id.id}/myTournamentInPlayer`,
    `/playerDetail/${id.id}/requestInPlayer`,
    `/playerDetail/${id.id}/scheduleInPlayer`,
    `/playerDetail/${id.id}/achivementInPlayer`,
  ];
  useEffect(() => {
    getMyAccount();
    window.addEventListener("click",()=>{
     setClickUserMenu(false)
    })
  }, []);
  useEffect(() => {
    setactiveMenu(location.pathname);
  }, [location]);

  const checkTour = () => {
    if (tourHighlight.indexOf(window.location.pathname) < 0) {
      return "title";
    } else {
      return "title active";
    }
  };

  const checkTeam = () => {
    if (teamHighlight.indexOf(window.location.pathname) < 0) {
      return "title";
    } else {
      return "title active";
    }
  };

  const checkPlayer = () => {
    if (playerHighlight.indexOf(window.location.pathname) < 0) {
      return "title";
    } else {
      return "title active";
    }
  };
  return (
    <header className="header">
      <div className="container-fluid">
        <div className="logo">
          <Link to={"/"}>
            <img
              src="/assets/img/homepage/logo.png"
              alt="logo"
              className="logo"
            />
          </Link>
        </div>
        <ul className="menu">
          <li>
            <Link
              to={"/"}
              className={
                activeMenu === "/home" || activeMenu === "/"
                  ? "title active"
                  : "title"
              }
              onClick={() => setactiveMenu("/home")}
            >
              Trang chu??
            </Link>
          </li>
          <li className="tourheader">
            <span className={checkTour()}>Gia??i ??????u</span>
            <div className="sub_menu">
              <Link
                to={"/findTournaments"}
                onClick={() => setactiveMenu("/findTournaments")}
              >
                Ti??m gia??i ??????u
              </Link>
              <Link
                to={"/createTournament"}
                onClick={() => setactiveMenu("/createTournament")}
              >
                Ta??o gia??i ??????u
              </Link>
            </div>
          </li>
          <li className="teamheader">
            <span className={checkTeam()}>??????i bo??ng</span>
            <div className="sub_menu">
              <Link to={"/findTeam"} onClick={() => setactiveMenu("/findTeam")}>
                Ti??m ??????i bo??ng
              </Link>
              <Link
                to={"/createTeam"}
                onClick={() => setactiveMenu("/findTeam")}
              >
                Ta??o ??????i bo??ng
              </Link>
            </div>
          </li>
          <li>
            <Link
              to={"/footballPlayer"}
              className={checkPlayer()}
              onClick={() => setactiveMenu("/footballPlayer")}
            >
              C???u th???
            </Link>
          </li>
        </ul>
        <div className="account">
          {user ? (
            <div
              className="current"
              onClick={(e) => {
                e.stopPropagation();
                setClickUserMenu(!clickUserMenu);
              }}
            >
              <div className="avatar">
                <img src={myAccount.avatar} alt={myAccount.username} />
              </div>
              <p className="name_account">{myAccount.username}</p>
              <i>
                <img src="/assets/icons/arrowDown.svg" alt="arrowDown" />
              </i>
            </div>
          ) : (
            <div className="current">
              <Link to={"/login"} className="login__text">
                ????ng nh????p
              </Link>
              <span className="dash">/</span>
              <Link to={"/signup"} className="login__text">
                ????ng ky??
              </Link>
            </div>
          )}
          {user ? <Notification /> : null}
          {user ? (
            <div className={clickUserMenu ? "popup_down active" : "popup_down"}>
              <Link to={"/profile"}>H???? s??</Link>
              <Link to={`/playerDetail/${myAccount.id}/myTeamInPlayer`}>
                Th??ng tin c????u thu??
              </Link>
              <Link to={`/teamDetail/${myAccount.id}/inforTeamDetail`}>
                ??????i bo??ng cu??a ba??n
              </Link>
              <Link to={`/myListTournament`}>Gia??i ??????u cu??a ba??n</Link>
              <a href="#" onClick={signout}>
                ????ng xu????t
              </a>
            </div>
          ) : null}
          <div
            className={`btn__menu ${clickMenu}`}
            onClick={() => setClickMenu((clickMenu) => !clickMenu)}
          >
            <span></span>
          </div>
        </div>
        <nav className={`nav ${clickMenu}`} id="nav">
          <ul className="menu --mobile">
            <li>
              <Link
                to={"/"}
                className={
                  activeMenu === "/home" || activeMenu === "/"
                    ? "title active"
                    : "title"
                }
                onClick={() => setactiveMenu("/home")}
              >
                Trang chu??
              </Link>
            </li>
            <li>
              <Link
                to={"/findTournaments"}
                className={
                  activeMenu === "/findTournaments" ? "title active" : "title"
                }
                onClick={() => setactiveMenu("/findTournaments")}
              >
                Gia??i ??????u
              </Link>
            </li>
            <li>
              <Link
                to={"/findTeam"}
                className={
                  activeMenu === "/findTeam" ? "title active" : "title"
                }
                onClick={() => setactiveMenu("/findTeam")}
              >
                ??????i bo??ng
              </Link>
            </li>
            <li>
              <a href="#">Gi????i thi????u</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
