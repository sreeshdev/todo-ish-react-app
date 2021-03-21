import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bucketListActions } from "../../_actions";
import MenuBar from "../../components/menubar";
import { Statistic, Button } from "semantic-ui-react";
import AddModal from "../../components/modal";
import TableData from "../../components/tableData";
import { db, auth } from "../../firebase";
import { connect } from "react-redux";
import {
  Container,
  Button as CircularButton,
  Link as CircularLink,
  lightColors,
  darkColors,
} from "react-floating-action-button";

const Home = ({ bucketState }) => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState({ status: false, modal: null });
  const [completedTodo, setCompletedTodo] = useState(0);
  const [recentTodo, setRecentTodo] = useState(null);
  let user = localStorage.getItem("user");
  //   let bucketState = useSelector((state) => state.bucketReducer);
  console.log("STATE", bucketState);
  const getBucket = async () => {
    let bucket = [];
    let count = 0;
    await db
      .collection("buckets")
      .where("createdBy", "==", user)
      .orderBy("createdAt", "desc")
      .get()
      .then((querySnapshot) => {
        count = querySnapshot.size;
        querySnapshot.forEach((doc) => {
          bucket = [...bucket, { id: doc.id, name: doc.data().name }];
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    console.log(bucket);
    if (bucket.length > 0)
      dispatch(
        bucketListActions.bucketListAdd({
          bucket,
          bucketCount: count,
          openModal: { status: false, modal: null, data: null, edit: false },
        })
      );
  };
  const getTodo = async () => {
    let todo = [];
    let completed = 0;
    await db
      .collection("todos")
      .where("createdBy", "==", user)
      .orderBy("createdAt", "desc")
      .get()
      .then((querySnapshot) => {
        console.log(querySnapshot);
        querySnapshot.forEach((doc) => {
          todo = [...todo, { id: doc.id, ...doc.data() }];
          doc.data().completed && ++completed;
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    setCompletedTodo(completed);
    let recent = todo.slice(0, 5);
    setRecentTodo(recent);
    dispatch(bucketListActions.todoListAdd({ todo }));
  };
  const completeTodo = async (todoTitle, status) => {
    console.log("TITLE", todoTitle, status);
    await db
      .collection("todos")
      .doc(todoTitle)
      .update({
        completed: !status,
      })
      .then(() => {
        console.log("Bucket successfully Created!");
        dispatch(
          bucketListActions.modal({
            status: false,
            modal: "close",
            edit: false,
            data: null,
          })
        );
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };
  const deleteTodo = async (todoId) => {
    await db
      .collection("todos")
      .doc(todoId)
      .delete()
      .then(() => {
        console.log("Todo successfully Deleted!");
        getTodo();
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };
  useEffect(() => {
    getBucket();
    getTodo();
  }, []);
  useEffect(() => {
    if (bucketState.openModal.modal === "close") {
      getBucket();
      getTodo();
    }
  }, [bucketState]);
  return (
    <>
      <MenuBar activeItem="home" />
      <div className="homeHead primary-color">
        <div className="head-partition">
          <Statistic>
            <Statistic.Label>Completed</Statistic.Label>
            <Statistic.Value>{completedTodo}</Statistic.Value>
          </Statistic>
        </div>
        <div className="head-partition">
          <Statistic>
            <Statistic.Label>Total</Statistic.Label>
            <Statistic.Value>
              {bucketState.todos ? bucketState.todos.length : 0}
            </Statistic.Value>
          </Statistic>
        </div>
        <div className="head-partition">
          <Statistic>
            <Statistic.Label>Buckets</Statistic.Label>
            <Statistic.Value>
              {bucketState.bucketCount ? bucketState.bucketCount : 0}
            </Statistic.Value>
          </Statistic>
        </div>
      </div>
      {/* <div className="homeHead2">
        <Button.Group>
          <Button
            onClick={() =>
              dispatch(
                bucketListActions.modal({ status: true, modal: "bucket" })
              )
            }
          >
            Create Bucket
          </Button>
          <Button.Or />
          <Button
            onClick={() =>
              dispatch(bucketListActions.modal({ status: true, modal: "todo" }))
            }
          >
            Create To-Do
          </Button>
        </Button.Group>
      </div> */}
      <AddModal open={bucketState.openModal} setOpen={setOpenModal} />
      <div className="recentTable">
        <TableData
          todoList={recentTodo}
          completeTodo={completeTodo}
          deleteTodo={deleteTodo}
          from="recents"
        />
      </div>
      <Container>
        <CircularButton
          tooltip="Create Bucket"
          icon="fa fa-archive"
          styles={{
            backgroundColor: darkColors.purple,
            color: lightColors.white,
            cursor: "pointer",
          }}
          onClick={() =>
            dispatch(bucketListActions.modal({ status: true, modal: "bucket" }))
          }
        />
        <CircularButton
          tooltip="Create Todo"
          icon="fa fa-sticky-note-o"
          className="fab-item btn btn-link btn-lg text-white"
          styles={{
            backgroundColor: darkColors.purple,
            color: lightColors.white,
            cursor: "pointer",
          }}
          onClick={() =>
            dispatch(bucketListActions.modal({ status: true, modal: "todo" }))
          }
        />
        <CircularButton
          tooltip="Create!"
          icon="fa fa-plus"
          rotate={true}
          styles={{
            backgroundColor: darkColors.purple,
            color: lightColors.white,
            cursor: "pointer",
          }}
        />
      </Container>
    </>
  );
};
const mapStateToProps = function (state) {
  console.log("FULL", state);
  return {
    bucketState: state.bucketReducer,
  };
};
export default connect(mapStateToProps)(Home);
