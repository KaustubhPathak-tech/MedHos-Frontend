import React, { useCallback, useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../Context/SocketProvider";
import Peer from "./Services/Peer";

import "./Room.css";
import { Box, Button, CircularProgress, Tooltip } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import styled from "@emotion/styled";
import IconButton from "@mui/material/IconButton";

import outgoing from "../../Assets/Audio/outgoing.mp3";

//widget
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneAltSlash,
  faCommentMedical,
  faVideo,
  faVideoSlash,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";

import Hangup from "../../Assets/Hangup.jpg";
import staticImage from "../../Assets/videono.png";

const Room = () => {
  const socket = useSocket();

  //message char settings
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const messagesColumnRef = useRef(null); // Add this

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          Email: data.Email,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    // Remove event listener on component unmount
    return () => socket.off("receive_message");
  }, [socket]);
  // Add this
  useEffect(() => {
    // Last 100 messages sent in the chat room (fetched from the db in backend)
    socket.on("last_100_messages", (last100Messages) => {
      console.log("Last 100 messages:", JSON.parse(last100Messages));
      last100Messages = JSON.parse(last100Messages);
      // Sort these messages by __createdtime__
      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
    });

    return () => socket.off("last_100_messages");
  }, [socket]);

  // useEffect(() => {
  //   messagesColumnRef.current.scrollTop =
  //     messagesColumnRef.current.scrollHeight;
  // }, [messagesRecieved]);

  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [recipient, setRecipient] = useState("");
  const handleSendMessage = () => {
    if (message && recipient) {
      socket.emit("chat:message", { message, recipient });
      setChatMessages([...chatMessages, { sender: "You", message }]);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("chat:message", ({ sender, message }) => {
      setChatMessages([...chatMessages, { sender, message }]);
    });

    return () => {
      socket.off("chat:message");
    };
  }, [socket, chatMessages]);
  const sendMessage = () => {
    if (message !== "") {
      const __createdtime__ = Date.now();
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      socket.emit("send_message", { Email, Room, message, __createdtime__ });
      setMessage("");
    }
  };

  //chatbox settings
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 360,
        padding: "20px",
        backgroundColor: "",
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {/* <ListItem disablePadding>
          <ListItemButton>Find Doctors</ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton href="/consult">Video Consult</ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>Medicines</ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>Lab Tests</ListItemButton>
        </ListItem> */}

        {/* {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))} */}
      </List>
      {/* <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
      <div>
        <h2>Chat</h2>
        <div className="messageColumn" ref={messagesColumnRef}>
          {messagesRecieved.map((msg, i) => (
            <div className="message" key={i}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="msgMeta">{msg.Email}</span>
                <span className="msgMeta">
                  {formatDateFromTimestamp(msg.__createdtime__)}
                </span>
              </div>
              <p className="msgText">{msg.message}</p>
              <br />
            </div>
          ))}
        </div>
        <div className="sendMessageContainer">
          <input
            className="messageInput"
            placeholder="Message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button className="btn btn-primary" onClick={sendMessage}>
            Send Message
          </button>
        </div>
      </div>
    </Box>
  );

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const [remoteSocket, SetRemoteSocket] = useState(null);
  const {roomId}=useParams();
  var User = useSelector((state) => state.fetch_current_userReducer);
  const Email = roomId;
  const Room = roomId;
  const [init, setInit] = useState(false);
  const handleSubmit = useCallback(
    (e) => {
      // e.PreventDefault();
      socket.emit("room:join", { Email, Room });
      setInit(true);
    },
    [Email, Room, socket]
  );
  const handleJoinRoom = useCallback(({ Email, Room }) => {
    console.log("room:join", { Email, Room });
  }, []);

  useEffect(() => {
    socket.on("room:join", ({ Email, Room }) => {
      handleJoinRoom({ Email, Room });
    });

    return () => {
      socket.off("room:join", ({ Email, Room }) => {
        handleJoinRoom({ Email, Room });
      });
    };
  }, [socket, handleJoinRoom]);

  const [mystream, setMytream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const handleJoin = useCallback(
    ({ Email, id }) => {
      console.log(`Email ${Email} id ${id}} joined the room`);
      SetRemoteSocket(id);
    },
    [SetRemoteSocket]
  );
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      SetRemoteSocket(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMytream(stream);
      console.log(`Incoming call from ${from}`);
      const ans = await Peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket, setMytream, SetRemoteSocket]
  );
  const sendStream = useCallback(() => {
    for (const track of mystream.getTracks()) {
      Peer.peer.addTrack(track, mystream);
    }
  }, [mystream]);

  const handleCallAccepted = useCallback(
    async ({ from, ans }) => {
      await Peer.setLocalDescription(ans);
      console.log("call accepted");

      sendStream();
    },
    [sendStream]
  );
  const handleNegotiationNeeded = useCallback(async () => {
    console.log("negotiation needed");
    const offer = await Peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocket });
  }, [remoteSocket, socket]);
  useEffect(() => {
    Peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);

    return () => {
      Peer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
    };
  }, [handleNegotiationNeeded]);

  useEffect(() => {
    Peer.peer.addEventListener("track", async (e) => {
      const remotStream = e.streams;
      handleClose();
      setRemoteStream(remotStream[0]);
    });
  }, [mystream]);
  const handleNegotiationIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await Peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );
  // const navigate=useNavigate();

  const handleOpenTab = () => {
    // Replace 'https://example.com' with the desired URL
    const newTab = window.open("https://medhos.vercel.app/", "_blank");
    if (newTab) {
      newTab.focus(); // Bring focus to the newly opened tab (optional)
    }
  };
  const handleHangup = () => {
    socket.emit("hangup", { to: remoteSocket });
    if (mystream) {
      mystream.getTracks().forEach((track) => track.stop());
      setMytream(null);
    }

    // Stop the remote stream if it exists
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }

    // Reset the audio and video enabled states
    setAudioEnabled(true);
    setVideoEnabled(true);

    // Reset the remoteSocket state
    SetRemoteSocket(null);
    handleOpenTab();
    // navigate(`/user/dash`);
  };

  const [streaming, setStreaming] = useState(false);
  const handleNegoFinal = useCallback(async ({ ans }) => {
    await Peer.setLocalDescription(ans);
    setStreaming(true);
  }, []);
  useEffect(() => {
    socket.on("user:joined", handleJoin);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegotiationIncoming);
    socket.on("peer:nego:final", handleNegoFinal);
    socket.on("hangup", handleHangup);
    return () => {
      socket.off("user:joined", handleJoin);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegotiationIncoming);
      socket.off("peer:nego:final", handleNegoFinal);
      socket.off("hangup", handleHangup);
    };
  }, [
    socket,
    handleJoin,
    handleIncomingCall,
    handleCallAccepted,
    handleNegotiationIncoming,
    handleNegoFinal,
  ]);
  //backdrop

  const [isIncomingAudioPlaying, setIsIncomingAudioPlaying] = useState(false);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const offer = await Peer.getOffer();
    socket.emit("user:call", { to: remoteSocket, offer });
    setMytream(stream);
    handleOpen();
    setIsIncomingAudioPlaying(true);
  }, [setMytream, remoteSocket, socket]);

  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioToggle = () => {
    if (mystream) {
      const audioTrack = mystream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled; // Toggle audio track state
        setAudioEnabled(!audioTrack.enabled); // Update the state variable
      }
    }
  };

  //video
  const [getlight, setGetlight] = useState(false);

  const [videoEnabled, setVideoEnabled] = useState(true);
  const videoToggle = () => {
    if (mystream) {
      const videoTrack = mystream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled; // Toggle video track state
        setVideoEnabled(!videoTrack.enabled); // Update the state variable
        setGetlight(!true);
      }
    }
  };

  return (
    <div id="room">
      {isIncomingAudioPlaying && (
        <audio
          src={outgoing}
          autoPlay
          onEnded={() => setIsIncomingAudioPlaying(false)}
        />
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {remoteSocket ? (
        <>
          <Button
            variant="contained"
            color="info"
            onClick={handleCallUser}
            hidden={streaming}
          >
            Call
          </Button>

          {mystream && (
            <>
              {/* <Button variant="contained" color="success" onClick={sendStream}>
                  Send Stream
                </Button> */}
              {/* <h4>My Stream</h4>
                <ReactPlayer
                  playing
                  
                  url={mystream}
                  
                  height="200px"
                  width="100px"
                /> */}
            </>
          )}

          {remoteStream ? (
            <>
              <ReactPlayer
                // light={staticImage}
                className="video-player"
                playing
                autoPlay
                // muted
                onStart={() => {
                  handleClose();
                  setIsIncomingAudioPlaying(false);
                }}
                url={remoteStream}
                height="60vh"
                width="60%"
                light={getlight}
                playIcon={<img src={staticImage} height="60vh" />}
                style={{
                  border: "0px solid black",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  padding: "10px 20px",
                  pointerEvents: "stroke",
                }}
              />
              <div id="box" className="button-container">
                {audioEnabled ? (
                  <>
                    <Tooltip title="unmute">
                      <Button
                        className="action-button"
                        variant="contained"
                        onClick={audioToggle}
                      >
                        {" "}
                        <FontAwesomeIcon icon={faMicrophoneSlash} size="2x" />
                      </Button>
                    </Tooltip>
                  </>
                ) : (
                  <Tooltip title="mute">
                    <Button
                      className="action-button"
                      variant="outlined"
                      onClick={audioToggle}
                    >
                      {" "}
                      <FontAwesomeIcon icon={faMicrophoneSlash} size="2x" />
                    </Button>
                  </Tooltip>
                )}
                {videoEnabled ? (
                  <>
                    <Button
                      className="action-button"
                      variant="contained"
                      onClick={videoToggle}
                    >
                      <>
                        <FontAwesomeIcon icon={faVideoSlash} size="2x" />
                      </>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="action-button"
                      variant="outlined"
                      onClick={videoToggle}
                    >
                      <>
                        <FontAwesomeIcon icon={faVideoSlash} size="2x" />
                      </>
                    </Button>
                  </>
                )}
                <React.Fragment>
                  <Button
                    className="action-button"
                    variant="outlined"
                    onClick={toggleDrawer("right", true)}
                  >
                    <>
                      <FontAwesomeIcon icon={faCommentMedical} size="2x" />
                    </>
                  </Button>
                  <Drawer
                    anchor="right"
                    open={state["right"]}
                    onClose={toggleDrawer("right", false)}
                  >
                    {list("left")}
                  </Drawer>
                </React.Fragment>
                <Button
                  className="action-button hangup-button"
                  onClick={handleHangup}
                >
                  <>
                    <img
                      src={Hangup}
                      width={20}
                      style={{ borderRadius: "10px" }}
                    />
                  </>
                </Button>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <Button onClick={handleSubmit} disabled={init}>
          {init ? "Waiting for Doctor" : "Start Meeting"}
        </Button>
      )}
    </div>
  );
};

export default Room;