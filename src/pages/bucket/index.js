import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { bucketListActions } from "../../_actions";
import MenuBar from "../../components/menubar";
import { Menu, Icon } from "semantic-ui-react";
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

const Bucket = ({ bucketState }) => {
  const dispatch = useDispatch();
  const [todoList, setTodoList] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState(null);
  let user = localStorage.getItem("user");
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
    console.log("BUK", bucket);
    if (bucket.length > 0) {
      !selectedBucket && setSelectedBucket(bucket[0]);
    }
    dispatch(
      bucketListActions.bucketListAdd({
        bucket,
        count,
        openModal: { status: false, modal: null, data: null, edit: false },
      })
    );
  };
  useEffect(() => {
    selectedBucket && getTodoList();
  }, [selectedBucket]);
  const getTodoList = async () => {
    let todo = [];
    console.log("SB", selectedBucket?.name);
    if (selectedBucket?.name) {
      await db
        .collection("todos")
        .where("createdBy", "==", user)
        .where("bucket", "==", selectedBucket?.name)
        .orderBy("createdAt", "desc")
        .get()
        .then((querySnapshot) => {
          console.log(querySnapshot);
          querySnapshot.forEach((doc) => {
            todo = [...todo, { id: doc.id, ...doc.data() }];
          });
          setTodoList(todo);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    } else {
      setTodoList([]);
    }
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
        console.log("Todo successfully Updated!");
        getTodoList();
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
    console.log("todoId");
    await db
      .collection("todos")
      .doc(todoId)
      .delete()
      .then(() => {
        console.log("Todo successfully Deleted!");
        getTodoList();
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };
  const deleteBucket = async (bucket) => {
    await db
      .collection("buckets")
      .doc(bucket.id)
      .delete()
      .then(() => {
        console.log("Bucket successfully Deleted!");
        // getBucket();
        deleteBucketTodo(bucket);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };
  const deleteBucketTodo = async (bucket) => {
    await db
      .collection("todos")
      .where("bucket", "==", bucket.name)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
        getBucket();
        getTodo();
        setTodoList([]);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
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
    console.log("DELETe", todo);
    dispatch(bucketListActions.todoListAdd({ todo }));
  };
  useEffect(() => {
    getBucket();
  }, []);
  useEffect(() => {
    if (bucketState.openModal.modal === "close") {
      getTodoList();
      getBucket();
    }
  }, [bucketState]);
  return (
    <>
      <MenuBar activeItem="bucket" />
      {bucketState?.bucket?.length > 0 ? (
        <Menu tabular inverted className="bucket-menu">
          {bucketState?.bucket?.map((bucket) => {
            return (
              <Menu.Item
                name={bucket.name}
                active={
                  selectedBucket?.id === bucket.id ||
                  bucketState?.bucket.length === 1
                }
                onClick={() => setSelectedBucket(bucket)}
              >
                {bucket.name}
                {selectedBucket?.id === bucket.id && (
                  <Icon
                    style={{ cursor: "pointer", marginLeft: "10px" }}
                    color="white"
                    name="trash alternate outline"
                    onClick={() => deleteBucket(bucket)}
                  />
                )}
              </Menu.Item>
            );
          })}
        </Menu>
      ) : (
        <div className="no-data">No Bucket Added</div>
      )}
      {bucketState?.bucket?.length > 0 && (
        <div className="todo-table">
          <TableData
            todoList={todoList}
            completeTodo={completeTodo}
            deleteTodo={deleteTodo}
          />
        </div>
      )}
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

      <AddModal open={bucketState.openModal} />
    </>
  );
};
const mapStateToProps = function (state) {
  console.log("FULL", state);
  return {
    bucketState: state.bucketReducer,
  };
};

export default connect(mapStateToProps)(Bucket);
