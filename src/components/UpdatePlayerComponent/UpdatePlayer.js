import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAPI } from "../../api";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import LoadingAction from "../LoadingComponent/LoadingAction";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import styles from "./styles/style.module.css";
import {getAllTeamByPlayerIdAPI} from "../../api/PlayerInTeamAPI"
import postNotifacation from "../../api/NotificationAPI";
function UpdatePlayer() {
  let navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const { idPlayer } = useParams();
  const [avt, setAvt] = useState({
    value: "",
    img: null,
    error: "",
  });
  const [namePlayer, setNamePlayer] = useState({
    value: "",
    error: "",
  });

  const [position, setPosition] = useState({
    value: "",
    error: "",
  });
  const [desc, setDesc] = useState({
    value: "",
    error: "",
  });
  const [loading, setLoading] = useState(false);
  const [btnActive, setBtnActive] = useState(false);
  const [team,setTeam] = useState(null);
  useEffect(() => {
    getUser();
    getTeamPlayerPaticipate();
  }, []);
  const getTeamPlayerPaticipate = () => {
    const response = getAllTeamByPlayerIdAPI(idPlayer,true,1,20);
    response.then(res => {
      if(res.status === 200){
        setTeam(res.data.playerInTeamsFull)
      }
    }).catch(err => {
      console.error(err);
    })
  }

  const postNotificationforTeamManager = async (userId,team,playerName) => {
    const data = {
      content: `Cầu thủ ${playerName} trong ${team.teamName} của bạn đã thay đổi thông tin cá nhân.Xem ngay `,
      userId: userId,
      tournamentId: 0,
      teamId: team.id,
    };
    try {
      const response = await postNotifacation(data);
      if (response.status === 201) {
        
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getUser = () => {
    let afterDefaultURL = `football-players/${idPlayer}`;
    let response = getAPI(afterDefaultURL);
    response
      .then((res) => {
        setNamePlayer({ value: res.data.playerName });
        setAvt({ value: res.data.playerAvatar, img: res.data.playerAvatar });
        setDesc({ value: res.data.description });
        setPosition({ value: res.data.position });
      })
      .catch((err) => console.error(err));
  };
  const validateForm = (name, value) => {
    switch (name) {
      case "avt":
        break;
      case "name":
        if (value.length === 0) {
          return {
            flag: false,
            content: "*Không được để trống",
          };
        } else if (/\d+/.test(value)) {
          return {
            flag: false,
            content: "*Tên cầu thủ là chữ",
          };
        }
        break;
      case "position":
        break;
      case "desc":
        break;
      default:
        break;
    }

    return { flag: true, content: null };
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (namePlayer.value === null || namePlayer.value === "") {
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
    }
    try {
      const data = {
        id: idPlayer,
        playerName: namePlayer.value,
        playerAvatar: avt.value,
        position: position.value,
        description: desc.value,
      };
      const response = await axios.put(
        "https://afootballleague.ddns.net/api/v1/football-players",
        data,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        for(const item of team){
          await postNotificationforTeamManager(item.team.id,item.team,namePlayer.value)
        }
        setLoading(false);
        toast.success("Cập nhật thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        const intitalState = {
          value: "",
          error: "",
        };
        setAvt(intitalState);
        setNamePlayer(intitalState);
        setPosition({
          value: "striker",
          error: "",
        });
        setDesc(intitalState);
        setBtnActive(false);
        navigate(`/playerDetail/${response.data.id}/myTeamInPlayer`);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      console.error(error.response);
    }
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    const flagValid = validateForm(name, value);
    if (flagValid.flag) {
      setBtnActive(true);
    } else {
      setBtnActive(false);
    }
    switch (name) {
      case "avt":
        const valueAvt = URL.createObjectURL(e.target.files[0]);
        setAvt({
          ...avt,
          img: valueAvt,
          value: e.target.files[0],
        });
        break;
      case "name":
        let name = null;
        if (flagValid.flag === false) {
          name = {
            value,
            error: flagValid.content,
          };
        } else {
          name = {
            value,
            error: null,
          };
        }
        setNamePlayer({
          ...name,
        });
        break;
      case "position":
        let position = null;
        if (flagValid.flag === false) {
          position = {
            value,
            error: flagValid.content,
          };
        } else {
          position = {
            value,
            error: null,
          };
        }

        setPosition({
          ...position,
        });
        break;
      case "desc":
        let desc = null;
        if (flagValid.flag === false) {
          desc = {
            value,
            error: flagValid.content,
          };
        } else {
          desc = {
            value,
            error: null,
          };
        }
        setDesc({
          ...desc,
        });
        break;
      default:
        break;
    }
  };
  return (
    <>
      <ScrollToTop />
      <Header />

      <form onSubmit={onSubmitHandler}>
        <div className={styles.create__team}>
          <h2 className={styles.title}>Cập nhật thông tin cầu thủ cho bạn</h2>
          <p className={styles.avt}>Hình ảnh thi đấu</p>
          <div className={styles.main__team}>
            <div className={styles.input__field}>
              <input
                accept="image/*"
                type="file"
                name="avt"
                id="file"
                onChange={onChangeHandler}
              />
              <img
                src={
                  avt.value === ""
                    ? "/assets/img/createteam/camera.png"
                    : avt.img
                }
                alt="camera"
                className={avt.value === "" ? styles.cmr : styles.cmrb}
              />
              <label for="file" className={styles.input__label}>
                Tải ảnh lên
                <i className={styles.icon__upload}>
                  <img
                    src="/assets/img/createteam/download.svg"
                    alt="dw"
                    className={styles.dw}
                  />
                </i>
              </label>
            </div>
            <div className={styles.createteamwrap}>
              <div className={styles.text__field}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <label for="nameteam">Tên thi đấu</label>

                  {namePlayer.error != null ? (
                    <p className={styles.error}>{namePlayer.error}</p>
                  ) : (
                    <p></p>
                  )}
                </div>

                <input
                  autoComplete="off"
                  type="text"
                  name="name"
                  id="nameteam"
                  placeholder="Tên thi đấu *"
                  value={namePlayer.value}
                  onChange={onChangeHandler}
                  required
                />
              </div>
            </div>
            <div className={styles.createteamwrap}>
              <div className={styles.text__field}>
                <label for="genderteam">Vị trí yêu thích</label>
                <select
                  name="position"
                  value={position.value}
                  onChange={onChangeHandler}
                  id="genderteam"
                  required
                >
                  <option value="striker">Tiền đạo</option>
                  <option value="midfielder">Tiền vệ</option>
                  <option value="defender">Hậu vệ</option>
                  <option value="goalkeeper">Thủ môn</option>
                </select>
              </div>
            </div>
            <div className={styles.createteamwrapb}>
              <p className={`${styles.avt} ${styles.line3}`}>Mô tả bản thân</p>{" "}
              <textarea
                onChange={onChangeHandler}
                name="desc"
                value={desc.value}
                placeholder="Mô tả bản thân"
                className={styles.descTeam}
              />
            </div>
          </div>
          <div className={styles.optionBtn}>
            <input
              type="button"
              className={styles.cancleCreate}
              onClick={() => {
                navigate(-1);
              }}
              value="Hủy tạo"
            />
            {user !== null && user.userVM.id == idPlayer && btnActive ? (
              <input
                style={{
                  float: "right",
                }}
                type="submit"
                className={styles.createTeam_btn}
                value="Cập nhật cầu thủ"
              />
            ) : null}
          </div>
        </div>
      </form>
      {loading ? <LoadingAction /> : null}
      <Footer />
    </>
  );
}

export default UpdatePlayer;
