import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getTournamentById } from "../../api/TournamentAPI";
import Loading from "../LoadingComponent/Loading";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import gsap from "gsap";
import AOS from "aos";
import Transitions from "../Transitions/Transitions";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import CompetitionFormat from "../CreateTournament/CompetitionFormat";
import Description from "../CreateTournament/Description";
import { updateTournamentInfoAPI } from "../../api/TournamentAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import styles from "../CreateTournament/styles/style.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingAction from "../LoadingComponent/LoadingAction";
import ModalNotiUpdate from "./ModalNotiUpdate";
import { async } from "@firebase/util";
import { deleteTeamInMatchByTourIdAPI } from "../../api/TeamInMatchAPI";
import { deleteMatchByTourIdAPI, createSchedule } from "../../api/MatchAPI";
import {
  getTeamPaticaipateInTourByTourIDAPI,
  updateTeamInScheduleAPI,
} from "../../api/TeamInTournamentAPI";
import postNotifacation from "../../api/NotificationAPI";
import myData from "../../provice.json";
const UpdateTournamentInformation = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const [hideShowNoti, setHideShowNoti] = useState(false);
  const addressTour = location.state.address;
  const lengthTeamPaticipate = location.state.lengthTeamPaticipate;
  const allTeam = location.state.allTeam;
  const tourDetail = location.state.tourDetail;
  const idTournament = location.state.id;
  const [loadingAction, setLoadingAction] = useState(false);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(-1);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML("<p>My initial content.</p>")
      )
    )
  );
  const [typeNoti, setTypeNoti] = useState("default");
  const descriptionText = draftToHtml(
    convertToRaw(editorState.getCurrentContent())
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [imgTournament, setImgTournament] = useState({
    value: "",
    img: null,
    error: null,
  });
  const [nameTournament, setNameTournament] = useState({
    value: "",
    error: null,
  });
  const [teamPaticipate, setTeamPaticipate] = useState({
    value: "",
    error: null,
  });
  const [beginTeamPaticipate, setBeginTeamPaticipate] = useState(null);
  const [typeFootballField, setTypeFootballField] = useState({
    value: "Field5",
    error: null,
  });
  const [closeRegister, setCloseRegister] = useState({
    value: null,
    error: null,
  });
  const [startTime, setStartTime] = useState({
    value: null,
    error: null,
  });
  const [endTime, setEndTime] = useState({
    value: null,
    error: null,
  });
  const [competitionFormat, setCompetitionFormat] = useState({
    value: 1,
    error: null,
  });
  const [beginCompetitionFormat, setBeginCompetitionFormat] = useState(null);
  const [minimunPlayerInTournament, setMinimunPlayerInTournament] = useState({
    value: null,
    error: null,
  });
  const [phoneContact, setPhoneContact] = useState({
    value: null,
    error: null,
  });
  const [footballField, setFootballField] = useState({
    value: null,
    error: null,
  });
  const [gender, setGender] = useState({
    value: "Male",
    error: null,
  });
  const [timeDuration, setTimeDuration] = useState({
    value: "15",
    error: null,
  });
  const [groupNumber, setGroupNumber] = useState({
    value: "2",
    error: null,
  });

  const [beginGroupNumber, setBeginGroupNumber] = useState(null);
  const [btnActive, setBtnActive] = useState(false);
  const [resetProvice, setResetProvice] = useState(-1);
  const [provice, setProvice] = useState(null);
  const [districts, setDistricts] = useState(null);
  const [wards, setWards] = useState(null);
  const [addressField, setAddressField] = useState(null);
  const [proviceSearch, setProviceSearch] = useState(null);
  const [districSearch, setDistricSearch] = useState(null);
  const [wardSearch, setWardSearch] = useState(null);
  AOS.init();
  const tour = gsap.timeline();
  const [changeFormat, setChangeFormat] = useState(false);
  const getAllCity = async () => {
    setProvice(myData);
    const proviceCurrent = addressTour.split(", ")[3];
    const findDistrictByNameProvice = myData.find(
      (item) => item.name === proviceCurrent
    );
    setProviceSearch(findDistrictByNameProvice.name);
    const allDistrict = findDistrictByNameProvice.districts;
    setDistricts(allDistrict);
    const districtCurrent = addressTour.split(", ")[2];
    const findWardsByDistrictName = findDistrictByNameProvice.districts.find(
      (item) => item.name === districtCurrent
    );
    setDistricSearch(findWardsByDistrictName.name);
    const wardCurrent = addressTour.split(", ")[1];

    const allWard = findWardsByDistrictName.wards;
    const findWards = allWard.find((item) => item.name === wardCurrent);

    setWardSearch(findWards.name);
    setWards(allWard);
  };
  useEffect(() => {
    if (lengthTeamPaticipate > 0) {
      setHideShowNoti(true);
      setTypeNoti("hasTeam");
    }
  }, []);

  const ChangeDate = (data) => {
    const sampleData = data.split("-")[0] + "-" + data.split("-")[1] + "-";
    const date = +data.split("-")[2] + 1;
    const newDate = date >= "10" ? date : "0" + date;
    return sampleData + newDate;
  };
  const getInforTournamentById = async () => {
    const response = await getTournamentById(idTournament);
    if (response.status === 200) {
      const team = response.data;
      setCloseRegister({
        value: team.registerEndDate,
        error: null,
      });
      setStartTime({
        value: team.tournamentStartDate,
        error: null,
      });
      setEndTime({
        value: team.tournamentEndDate,
        error: null,
      });
      setTeam(response.data);

      setStatus(team.mode === "PUBLIC" ? 0 : -1);
      setImgTournament({
        value: null,
        img: team.tournamentAvatar,
        error: null,
      });
      setNameTournament({
        value: team.tournamentName,
        error: null,
      });
      setTeamPaticipate({
        value: team.footballTeamNumber,
        error: null,
      });
      setBeginTeamPaticipate(team.footballTeamNumber);
      setTypeFootballField({
        value:
          team.footballFieldTypeId === 1
            ? "Field5"
            : team.footballFieldTypeId === 2
            ? "Field7"
            : "Field11",
        error: null,
      });
      setGender({
        value: team.tournamentGender,
        error: null,
      });

      setCloseRegister({
        value: ChangeDate(
          new Date(team.registerEndDate).toISOString().slice(0, 10)
        ),
        error: null,
      });

      setStartTime({
        value: ChangeDate(
          new Date(team.tournamentStartDate).toISOString().slice(0, 10)
        ),
        error: null,
      });
      setEndTime({
        value: ChangeDate(
          new Date(team.tournamentEndDate).toISOString().slice(0, 10)
        ),
        error: null,
      });
      setTimeDuration({
        value: team.matchMinutes,
        error: null,
      });
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(convertFromHTML(team.description))
        )
      );
      setBeginCompetitionFormat(
        team.tournamentTypeId === 1
          ? "KnockoutStage"
          : team.tournamentTypeId === 2
          ? "CircleStage"
          : "GroupStage"
      );
      setCompetitionFormat({
        value:
          team.tournamentTypeId === 1
            ? "KnockoutStage"
            : team.tournamentTypeId === 2
            ? "CircleStage"
            : "GroupStage",
        error: null,
      });
      setMinimunPlayerInTournament({
        value: team.footballPlayerMaxNumber,
        error: null,
      });
      setPhoneContact({
        value: team.tournamentPhone,
        error: null,
      });
      setFootballField({
        value: team.footballFieldAddress.split(",")[0],
        error: null,
      });
      setGroupNumber({
        value: team.groupNumber + "",
        error: null,
      });
      setBeginGroupNumber(team.groupNumber + "");
      // setProviceSearch({
      //   value: team.footballFieldAddress.split(", ")[3],
      //   error:null
      // })
      // setDistricSearch({
      //   value: team.footballFieldAddress.split(", ")[2],
      //   error:null
      // })
      // setWardSearch({
      //   value: team.footballFieldAddress.split(", ")[1],
      //   error:null
      // })
      //   setEditorState(team.description)
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateTournamentDetail();
  };
  const updateTournamentDetail = async () => {
    
    setLoadingAction(true);

    const flag = checkValidateAdd();
    if (flag !== null) {
      setLoading(false);
      toast.error(flag, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      if (
        beginCompetitionFormat === competitionFormat.value &&
        beginTeamPaticipate === teamPaticipate.value &&
        (beginGroupNumber === -1 || beginGroupNumber === groupNumber.value)
      ) {
        try {
          const data = {
            Id: idTournament,
            tournamentName: nameTournament.value,
            mode: status === -1 ? "PRIVATE" : "PUBLIC",
            tournamentPhone: phoneContact.value,
            tournamentGender: gender.value,
            registerEndDate: closeRegister.value,
            tournamentStartDate: startTime.value,
            tournamentEndDate: endTime.value,
            footballFieldAddress:
              addressField != null
                ? footballField.value + addressField
                : addressTour,
            tournamentAvatar: imgTournament.value,
            description: descriptionText,
            matchMinutes: +timeDuration.value,
            footballTeamNumber: +teamPaticipate.value,
            footballPlayerMaxNumber: minimunPlayerInTournament.value,
            status: true,
            groupNumber: +groupNumber.value,
            userId: user.userVM.id,
            TournamentTypeEnum: competitionFormat.value,
            TournamentFootballFieldTypeEnum: typeFootballField.value,
          };
          
          const response = await updateTournamentInfoAPI(data);
          if (response.status === 200) {
            if (typeNoti !== "hasTeam" && typeNoti !== "default") {
              await createGenerateTable(response.data.id);
            }
            navigate(-1);
            setLoading(false);
            const intitalState = {
              value: "",
              error: "",
            };
            setImgTournament(intitalState);
            setNameTournament(intitalState);
            setTeamPaticipate(intitalState);
            setTypeFootballField({
              value: 1,
              error: "",
            });

            setCloseRegister({
              value: new Date().toJSON(),
              error: "",
            });
            setStartTime({
              value: new Date().toJSON(),
              error: "",
            });
            setEndTime({
              value: new Date().toJSON(),
              error: "",
            });
            setCompetitionFormat({
              value: 1,
              error: "",
            });
            setMinimunPlayerInTournament(intitalState);
            setPhoneContact(intitalState);
            setFootballField(intitalState);
            setGender({
              value: "Male",
              error: "",
            });
            setTimeDuration({
              value: 15,
              error: "",
            });
            setEditorState(EditorState.createEmpty());
            setProvice(null);
            setDistricts(null);
            setWards(null);
            setResetProvice(0);
            setGroupNumber({
              value: "2",
              error: null,
            });
            // navigate(`tournamentDetail/${idTournament}/inforTournamentDetail`);
          }
        } catch (error) {
          setLoadingAction(false);
          toast.error(error.response.data.message, {
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
      } else {
        // delete match detail and add again.
        setTypeNoti("Noteam");
        setLoading(false);
        setHideShowNoti(true);
      }
    }
  };
  const postNotificationforTeamManager = async (idTeam, idTour, idUser) => {
    const data = {
      content: `${tourDetail.tournamentName} thay đổi thông tin giải đấu. Xem ngay`,
      userId: idUser,
      tournamentId: 0,
      teamId: idTeam,
    };
    try {
      const response = await postNotifacation(data);
    } catch (err) {
      console.error(err);
    }
  };
  const getTeamInTourByTourid = async () => {
    try {
      const response = await getTeamPaticaipateInTourByTourIDAPI(idTournament);
      if (response.status === 200) {
        const teamInTournament = response.data.teamInTournaments;
        for (const index in teamInTournament) {
          await addTeamInSchedule(teamInTournament[index].id, true, +index + 1);
        }
        setTimeout(() => {
          navigate(`/tournamentDetail/${idTournament}/inforTournamentDetail`);
          setLoadingAction(false);
          setLoading(false);
          toast.success("Thay đổi thông tin giải đấu thành công", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }, 2000);
        for (const item of allTeam) {
          await postNotificationforTeamManager(item.id, tourDetail.id, item.id);
        }
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const addTeamInSchedule = (idTeamInTour, status, index) => {
    const data = {
      teamInTournamentId: idTeamInTour,
      typeUpdate: status,
      teamIndex: index,
    };
    console.log(data);
    const response = updateTeamInScheduleAPI(data);
    response
      .then((res) => {
        if (res.status === 200) {
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const createGenerateTable = (id) => {
    setLoading(true)
    const response = createSchedule(id);
    response
      .then((res) => {
        if (res.status === 200) {
          if (lengthTeamPaticipate > 0) {
            getTeamInTourByTourid();
          } else {
            setLoading(false);
            navigate(`/tournamentDetail/${id}/inforTournamentDetail`);
            setLoadingAction(false);
            toast.success("Thay đổi thông tin giải đấu thành công", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
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
  useEffect(() => {
    if (changeFormat === true) {
      deleteTeamInMatch();
    }
  }, [changeFormat === true]);
  const deleteTeamInMatch = async () => {
    try {
      const response = await deleteTeamInMatchByTourIdAPI(idTournament);

      if (response.status === 200) {
        
        await deleteMatch();
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };
  const deleteMatch = async () => {
    try {
      const response = await deleteMatchByTourIdAPI(idTournament);

      if (response.status === 200) {
        
        updateTournamentDetail();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const accpetChangCompetitionFormat = () => {
    
    setBeginCompetitionFormat(competitionFormat.value);
    setBeginGroupNumber(groupNumber.value);
    setBeginTeamPaticipate(teamPaticipate.value);
    setChangeFormat(true);
  };

  const validateForm = (name, value) => {
    switch (name) {
      case "imgTournament":
        break;
      case "nameTournament":
        if (value.length === 0) {
          return {
            flag: false,
            content: "Không được để trống",
          };
        } else if (/\d+/.test(value)) {
          return {
            flag: false,
            content: "Tên đội bóng là chữ",
          };
        }
        break;
      case "groupNumber":
        if (value.length === 0) {
          return {
            flag: false,
            content: "Không được để trống",
          };
        } else if (!/^[0-9]+$/.test(value)) {
          return {
            flag: false,
            content: "Đội tham gia là số",
          };
        } else if (value === 2 || value === 4) {
          return {
            flag: false,
            content: "Nhập 2 hoặc 4 bảng đấu",
          };
        }
        break;

      case "teamPaticipate":
        if (!/^[0-9]+$/.test(value)) {
          return {
            flag: false,
            content: "Đội tham gia là số",
          };
        }
        break;
      case "typeFootballField":
        break;
      case "closeRegister":
        break;
      case "startTime":
        break;
      case "endTime":
        break;
      case "competitionFormat":
        break;
      case "minimunPlayerInTournament":
        if (!/^[0-9]+$/.test(value)) {
          return {
            flag: false,
            content: "Đội tham gia là số",
          };
        }

        break;
      case "phoneContact":
        if (!/^[0-9]+$/.test(value)) {
          return {
            flag: false,
            content: "Số điện thoại không được là chữ hay kí tự khác",
          };
        }
        break;

      case "footballField":
        break;
      default:
        break;
    }
    return { flag: true, content: null };
  };
  const checkValidateAdd = () => {
    //nameTournament phoneContact minimunPlayerInTournament  teamPaticipate  closeRegister startTime endTime
    // if (
    //   closeRegister.value === null ||
    //   new Date(closeRegister.value).getTime() >=
    //     new Date(startTime.value).getTime()
    // ) {
    //   return "Ngày đăng ký phải trước ngày bắt đầu";
    // }
    if (nameTournament.value === null || nameTournament.value.length === 0) {
      return "Tên giải đấu không được để trống";
    }
    if (phoneContact.value === null || phoneContact.value.length === 0) {
      return "Số điện thoại không được để trống";
    } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(phoneContact.value)) {
      return "Sai định dạng số điện thoại";
    }
    if (teamPaticipate.value === null || teamPaticipate.value.length === 0) {
      return "Số đội tham gia không được để trống";
    } else if (
      competitionFormat.value === "CircleStage" &&
      lengthTeamPaticipate <= teamPaticipate.value &&
      (teamPaticipate.value < 3 || teamPaticipate.value > 8)
    ) {
      return "Số đội tham gia hình thức thi đấu vòng tròn nằm trong khoảng từ 3-8 đội";
    } else if (
      competitionFormat.value === "CircleStage" &&
      lengthTeamPaticipate > teamPaticipate.value &&
      (teamPaticipate.value < lengthTeamPaticipate || teamPaticipate.value > 8)
    ) {
      return `Số đội tham gia hình thức thi đấu vòng tròn nằm trong khoảng từ ${lengthTeamPaticipate}-8 đội`;
    } else if (
      competitionFormat.value === "KnockoutStage" &&
      lengthTeamPaticipate <= teamPaticipate.value &&
      (teamPaticipate.value < 3 || teamPaticipate.value > 16)
    ) {
      return "Số đội tham gia hình thức thi đấu trực tiếp nằm trong khoảng từ 3-16 đội";
    } else if (
      competitionFormat.value === "KnockoutStage" &&
      lengthTeamPaticipate > teamPaticipate.value &&
      (teamPaticipate.value < lengthTeamPaticipate || teamPaticipate.value > 16)
    ) {
      return `Số đội tham gia hình thức thi đấu trực tiếp nằm trong khoảng từ ${lengthTeamPaticipate}-16 đội`;
    } else if (
      competitionFormat.value === "GroupStage" &&
      lengthTeamPaticipate <= teamPaticipate.value &&
      (teamPaticipate.value < 6 || teamPaticipate.value > 16)
    ) {
      return "Số đội tham gia hình thức thi đấu chia bảng nằm trong khoảng từ 6-16 đội";
    } else if (
      competitionFormat.value === "GroupStage" &&
      lengthTeamPaticipate > teamPaticipate.value &&
      (teamPaticipate.value < lengthTeamPaticipate || teamPaticipate.value > 16)
    ) {
      return `Số đội tham gia hình thức thi đấu chia bảng nằm trong khoảng từ ${lengthTeamPaticipate}-16 đội`;
    }
    if (
      minimunPlayerInTournament.value === null ||
      minimunPlayerInTournament.value.length === 0
    ) {
      return "Số cầu thủ tối thiểu mỗi đội không được để trống";
    } else if (
      minimunPlayerInTournament.value <
      (typeFootballField.value == "Field5"
        ? 5
        : typeFootballField.value == "Field7"
        ? 7
        : 11)
    ) {
      return "Số cầu thủ ít hơn quy định loại sân";
    }
    return null;
  };
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    const validate = validateForm(name, value);
    if (validate.flag) {
      setBtnActive(true);
    } else {
      setBtnActive(false);
    }
    switch (name) {
      case "imgTournament":
        console.log(value);
        setImgTournament({
          ...imgTournament,
          value: e.target.files[0],
          img: URL.createObjectURL(e.target.files[0]),
          error: validate.content,
        });
        break;
      case "nameTournament":
        setNameTournament({
          ...nameTournament,
          value,
          error: validate.content,
        });
        break;
      case "teamPaticipate":
        if (competitionFormat.value === "GroupStage" && value < 12) {
          setGroupNumber({
            value: "2",
            error: null,
          });
        }
        setTeamPaticipate({
          ...teamPaticipate,
          value,
          error: validate.content,
        });
        break;
      case "groupNumber":
        setGroupNumber({
          ...teamPaticipate,
          value,
          error: validate.content,
        });
        break;
      case "typeFootballField":
        setTypeFootballField({
          ...typeFootballField,
          value,
          error: validate.content,
        });
        break;
      case "closeRegister":
        setCloseRegister({
          ...closeRegister,
          value,
          error: validate.content,
        });
        break;
      case "startTime":
        console.log(value);
        setStartTime({
          ...startTime,
          value,
          error: validate.content,
        });
        break;
      case "endTime":
        setEndTime({
          ...endTime,
          value,
          error: validate.content,
        });
        break;
      case "competitionFormat":
        setTeamPaticipate({
          value: "",
          error: null,
        });
        setGroupNumber({
          value: "2",
          error: null,
        });
        setCompetitionFormat({
          ...competitionFormat,
          value,
        });
        break;
      case "minimunPlayerInTournament":
        setMinimunPlayerInTournament({
          ...minimunPlayerInTournament,
          value,
          error: validate.content,
        });
        break;
      case "phoneContact":
        setPhoneContact({
          ...phoneContact,
          value,
          error: validate.content,
        });
        break;
      case "footballField":
        setFootballField({
          ...footballField,
          value,
          error: validate.content,
        });
        break;
      case "gender":
        setGender({
          ...gender,
          value,
          error: validate.content,
        });
        break;
      case "timeDuration":
        setTimeDuration({
          ...timeDuration,
          value,
          error: validate.content,
        });
        break;
      case "provice":
        let dataProvice = provice;
        const proviceFind = dataProvice.find((item) => item.name === value);
        setProviceSearch(value);
        setDistricSearch("default");
        setDistricts(proviceFind.districts);
        setWards(null);
        setAddressField(", " + value);
        break;
      case "districts":
        let dataDis = districts;

        const disFind = dataDis.find((item) => item.name === value);
        setDistricSearch(value);
        setWardSearch("default");
        setWards(disFind.wards);
        const oldAddress = addressField;
        setAddressField(", " + value + oldAddress);
        break;
      case "wards":
        setWardSearch(value);
        {
          const oldAddress = addressField;
          setAddressField(", " + value + oldAddress);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getInforTournamentById();
  }, []);

  useEffect(() => {
    setResetProvice(-1);
    getAllCity();
  }, [resetProvice]);

  // const addDays = (data, numDay) => {
  //   if (data !== undefined || data !== null) {
  //     const addDay = data;
  //     addDay.setTime(addDay.getTime() + numDay * 24 * 60 * 60 * 1000);
  //     if (addDay.toJSON().split("T") !== null)
  //       return addDay.toJSON().split("T")[0];
  //   }
  // };

  return (
    <>
      <ScrollToTop />
      <Transitions timeline={tour} />
      <Header />
      <div className={styles.createTournament}>
        <div className={styles.createTournament_info}>
          <div>
            <div>
              <h1 className={styles.createTournament_title}>
                Cập nhật giải đấu
              </h1>
              <hr width={100} size={10} className={styles.hr} />
            </div>
            <div
              style={{
                marginTop: 30,
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                id="switch"
                className={styles.switch__input}
              />
              <label
                htmlFor="switch"
                className={styles.switch}
                onClick={() => {
                  setStartTime({
                    value: null,
                    error: null,
                  });
                  setEndTime({
                    value: null,
                    error: null,
                  });
                  if (status === 0) {
                    setCloseRegister({
                      value: null,
                      error: null,
                    });
                    setStartTime({
                      value: null,
                      error: null,
                    });
                    setEndTime({
                      value: null,
                      error: null,
                    });
                    setStatus(-1);
                  } else {
                    setStartTime({
                      value: null,
                      error: null,
                    });
                    setEndTime({
                      value: null,
                      error: null,
                    });
                    setStatus(0);
                  }
                }}
              />
              <p
                style={{
                  marginLeft: 10,
                }}
              >
                Chế độ {status === 0 ? "công khai" : "riêng tư"}
              </p>
            </div>
          </div>
          <form onSubmit={onSubmitHandler}>
            <div className={styles.createTournament_row1}>
              <div className={styles.createTournament_img}>
                <h1 className={styles.createTournament_img_title}>
                  Hình giải đấu
                </h1>
                <div className={styles.wrapAvt}>
                  <input
                    type="file"
                    id="file_imgCreateTournament"
                    accept="image/*"
                    name="imgTournament"
                    onChange={onChangeHandler}
                    className={styles.file_imgCreateTournament}
                  />
                  <label
                    htmlFor="file_imgCreateTournament"
                    className={styles.createTournament_img_detail}
                  >
                    <img
                      style={{
                        width: 120,
                        margin: "auto",
                      }}
                      src={
                        imgTournament.value === ""
                          ? "assets/img/createteam/camera.png"
                          : imgTournament.img
                      }
                      alt="camera"
                      className={
                        imgTournament.value === "" ? styles.cmr : styles.cmrb
                      }
                    />

                    <p className={styles.btnUploadImg_createTournament}>
                      Tải ảnh lên{" "}
                      <i
                        style={{
                          marginLeft: 10,
                        }}
                        className="fa-solid fa-upload"
                      ></i>
                    </p>
                  </label>

                  {/* <input type="file" /> */}
                </div>
              </div>
              <div className={styles.createTournament_row1_col2}>
                <div className={styles.nameTournament}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <label
                      htmlFor="createTour"
                      className={styles.createTournament_img_title}
                    >
                      Tên giải đấu
                    </label>
                    {nameTournament.error != null ? (
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        {nameTournament.error}
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>

                  <input
                    id="createTour"
                    placeholder="Tên giải đấu"
                    onChange={onChangeHandler}
                    name="nameTournament"
                    value={nameTournament.value}
                  />
                </div>
                <div className={styles.contactPhone}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <label
                      htmlFor="phoneContact"
                      className={styles.createTournament_img_title}
                    >
                      Số điện thoại liên lạc
                    </label>
                    {phoneContact.error != null ? (
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        {phoneContact.error}
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>

                  <input
                    type="text"
                    id="phoneContact"
                    className={styles.phoneContact}
                    placeholder="Số điện thoại"
                    name="phoneContact"
                    value={phoneContact.value}
                    onChange={onChangeHandler}
                  />
                </div>
                <div>
                  <label
                    className={styles.createTournament_img_title}
                    htmlFor="genderteam"
                  >
                    Giới tính đội
                  </label>
                  <select
                    name="gender"
                    value={gender.value}
                    onChange={onChangeHandler}
                    id="genderteam"
                    className={styles.timeCloseRegister_input}
                    required
                  >
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                  </select>
                </div>
              </div>

              <div className={styles.createTournament_row1_col3}>
                <div className={styles.timeCloseRegister}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <label
                      htmlFor="timeCloseRegister"
                      className={styles.createTournament_img_title}
                    >
                      Ngày đóng đăng ký tham gia
                    </label>
                    {closeRegister.error != null ? (
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        {closeRegister.error}
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>
                  <input
                    className={styles.timeCloseRegister_input}
                    id="timeCloseRegister"
                    type="date"
                    name="closeRegister"
                    value={
                      closeRegister.value === null ? "" : closeRegister.value
                    }
                    //min={addDays(new Date(), 3)}
                    onChange={onChangeHandler}
                    disabled={status === 0 ? "" : "disable"}
                    required
                  />
                </div>

                <div className={styles.timeStart}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <label
                      className={styles.createTournament_img_title}
                      htmlFor="startTime"
                    >
                      Ngày bắt đầu
                    </label>
                    {startTime.error != null ? (
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        {startTime.error}
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>
                  <input
                    className={styles.timeStart_input}
                    id="startTime"
                    type="date"
                    // min={
                    //   status === 0
                    //     ? addDays(new Date(closeRegister.value), 1)
                    //     : addDays(new Date(), 3)
                    // }
                    name="startTime"
                    value={startTime.value === null ? "" : startTime.value}
                    // disabled={

                    //    (new Date(closeRegister.value).getTime() <=
                    //   new Date().getTime()) && status === 0 && closeRegister.value != null
                    //     ? ""
                    //     : status === -1
                    //     ? ""
                    //     : "disable"
                    // }
                    onChange={onChangeHandler}
                  />
                </div>

                <div className={styles.timeEnd}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <label
                      htmlFor="endTime"
                      className={styles.createTournament_img_title}
                    >
                      Ngày kết thúc
                    </label>
                    {endTime.error != null ? (
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        {endTime.error}
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>

                  <input
                    className={styles.timeEnd_input}
                    id="endTime"
                    type="date"
                    name="endTime"
                    value={endTime.value === null ? "" : endTime.value}
                    // min={
                    //   startTime.value !== null
                    //     ? addDays(new Date(startTime.value), 1)
                    //     : null
                    // }
                    // max={
                    //   startTime.value !== null
                    //     ? addDays(new Date(startTime.value), 31)
                    //     : null
                    // }
                    // disabled={(new Date(closeRegister.value).getTime() <=
                    //   new Date().getTime()) && startTime.value != null ? "" : "disable"}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>
            </div>
            <CompetitionFormat
              teamPaticipate={teamPaticipate}
              competitionFormat={competitionFormat}
              onChangeHandler={onChangeHandler}
              groupNumber={groupNumber}
              lengthTeamPaticipate={lengthTeamPaticipate}
            />

            <div className={styles.createTournament_row4}>
              <div className={styles.createTournament_row4_col1}>
                <div className={styles.mininum_member}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <label
                      htmlFor="mininum_member"
                      className={styles.createTournament_img_title}
                    >
                      Số cầu thủ tối thiểu mỗi đội
                    </label>
                    {minimunPlayerInTournament.error != null ? (
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        {minimunPlayerInTournament.error}
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>
                  <input
                    id="mininum_member"
                    className={styles.mininum_member_input}
                    name="minimunPlayerInTournament"
                    value={minimunPlayerInTournament.value}
                    onChange={onChangeHandler}
                    disabled={lengthTeamPaticipate > 0 ? "disabled" : ""}
                  />
                </div>

                <div className={styles.description_tournament}>
                  <label
                    htmlFor="description"
                    className={styles.createTournament_img_title}
                  >
                    Mô tả
                  </label>
                  {/* <textarea
                placeholder="Mô tả về giải đấu"
                
              /> */}
                  <div className={styles.descTeam}>
                    <Description
                      editorState={editorState}
                      setEditorState={setEditorState}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.createTournament_row4_col2}>
                <div className={styles.typeFootballField}>
                  <label className={styles.createTournament_img_title}>
                    Loại sân thi đấu
                  </label>
                  <select
                    disabled={lengthTeamPaticipate > 0 ? "disabled" : ""}
                    className={styles.select_typeFootballField}
                    onChange={onChangeHandler}
                    value={typeFootballField.value}
                    name="typeFootballField"
                  >
                    <option value="Field5">Sân thi đấu bóng đá 5</option>
                    <option value="Field7">Sân thi đấu bóng đá 7</option>
                    <option value="Field11">Sân thi đấu bóng đá 11</option>
                  </select>
                </div>
                <div className={styles.timeDuration}>
                  <label
                    className={styles.createTournament_img_title}
                    htmlFor="timeDuration"
                  >
                    Thời gian thi đấu mỗi trận
                  </label>
                  <select
                    disabled={lengthTeamPaticipate > 0 ? "disabled" : ""}
                    className={styles.select_typeFootballField}
                    id="timeDuration"
                    onChange={onChangeHandler}
                    value={timeDuration.value}
                    name="timeDuration"
                  >
                    <option value="15">15p</option>
                    <option value="30">30p</option>
                    <option value="45">45p</option>
                  </select>
                </div>
                <div className={styles.fieldSoccer}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: 65,
                      width: "100%",
                    }}
                  >
                    <label
                      className={styles.createTournament_img_title}
                      htmlFor="provice"
                    >
                      Thành phố/Tỉnh{" "}
                    </label>
                    <select
                      style={{
                        padding: "10px 5px",
                      }}
                      name="provice"
                      onChange={onChangeHandler}
                      value={proviceSearch}
                      disabled={lengthTeamPaticipate > 0 ? "disabled" : ""}
                    >
                      <option selected disabled>
                        Chọn thành phố
                      </option>
                      {provice != null
                        ? provice.map((item, index) => {
                            return (
                              <option value={item.name} key={index}>
                                {item.name}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: 65,
                      width: "100%",
                    }}
                  >
                    <label
                      className={styles.createTournament_img_title}
                      htmlFor="districts"
                    >
                      Quận/Huyện
                    </label>
                    <select
                      style={{
                        padding: "10px 5px",
                      }}
                      name="districts"
                      onChange={onChangeHandler}
                      value={districSearch}
                      disabled={lengthTeamPaticipate > 0 ? "disabled" : ""}
                    >
                      <option value="default" selected disabled>
                        Chọn quận
                      </option>
                      {districts != null
                        ? districts.map((item, index) => {
                            return (
                              <option value={item.name} key={index}>
                                {item.name}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: 65,
                      width: "100%",
                    }}
                  >
                    <label
                      className={styles.createTournament_img_title}
                      htmlFor="wards"
                    >
                      Phường/Xã
                    </label>
                    <select
                      style={{
                        padding: "10px 5px",
                      }}
                      name="wards"
                      onChange={onChangeHandler}
                      value={wardSearch}
                      disabled={lengthTeamPaticipate > 0 ? "disabled" : ""}
                    >
                      <option value="default" selected disabled>
                        Chọn phường
                      </option>
                      {wards != null
                        ? wards.map((item, index) => {
                            return (
                              <option value={item.name} key={index}>
                                {item.name}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                      }}
                    >
                      <label
                        className={styles.createTournament_img_title}
                        htmlFor="fieldSoccer"
                      >
                        Địa điểm
                      </label>
                      {footballField.error != null ? (
                        <p
                          style={{
                            color: "red",
                          }}
                        >
                          {footballField.error}
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>

                    <input
                      id="fieldSoccer"
                      className={styles.fieldSoccer_input}
                      placeholder="Nhập địa chỉ"
                      name="footballField"
                      value={footballField.value}
                      onChange={onChangeHandler}
                      disabled={lengthTeamPaticipate > 0 ? "disabled" : ""}
                    />
                  </div>
                </div>
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
              <div
                className={hideShowNoti ? "overlay active" : "overlay"}
              ></div>
              {/* {btnActive ? ( */}
              <input
                type="submit"
                className={styles.createTeam_btn}
                value="Thay đổi"
              />
              {/* ) : null} */}
            </div>
          </form>
        </div>
      </div>
      {loading ? <LoadingAction /> : null}
      {hideShowNoti ? (
        <ModalNotiUpdate
          typeNoti={typeNoti}
          hideShow={hideShowNoti}
          setHideShow={setHideShowNoti}
          accpetChangCompetitionFormat={accpetChangCompetitionFormat}
          setLoading={setLoading}
        />
      ) : null}
      <ToastContainer />
      <Footer />
    </>
  );
};

export default UpdateTournamentInformation;
