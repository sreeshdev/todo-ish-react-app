import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Select, Label } from "semantic-ui-react";
import _ from "lodash";
import { db, auth, fb } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { bucketListActions } from "../../_actions";

const AddModal = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  console.log(open);
  const [bucketName, setBucketName] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [todo, setTodo] = useState("");
  const [error, setError] = useState(null);
  let user = localStorage.getItem("user");
  let bucketState = useSelector((state) => state.bucketReducer);
  useEffect(() => {
    let suggestion = _.sampleSize(bucketState.bucket, 3);
    setSuggestions(suggestion);
    open.data?.bucketName && setBucketName(open.data?.bucketName);
    open.data?.todo && setTodo(open.data?.todo);
  }, [open]);
  const createBucket = async () => {
    // console.log(userId);
    if (bucketName.length > 0) {
      await db
        .collection("buckets")
        .add({
          name: bucketName,
          createdBy: user,
          createdAt: new Date(),
        })
        .then(() => {
          console.log("Bucket successfully Created!");
          setBucketName("");
          setTodo("");
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
    } else {
      setError("Set Bucket Name");
    }
  };
  const createTodo = async () => {
    console.log(open.edit, open.data);
    if (todo.length > 0 && bucketName.length > 0) {
      if (bucketState.bucket !== null) {
        console.log("BUCKETNULL", bucketState.bucket);
        let check = bucketState.bucket.filter((bucket) => {
          return bucket.name === bucketName;
        });
        check.length === 0 && createBucket();
      } else {
        createBucket();
      }
      if (open.edit) {
        console.log("EDIT");
        await db
          .collection("todos")
          .doc(open.data.id)
          .update({
            title: todo,
            bucket: bucketName,
          })
          .then(() => {
            console.log("Todo successfully Created!");
            setBucketName("");
            setTodo("");
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
      } else {
        await db
          .collection("todos")
          .add({
            title: todo,
            bucket: bucketName,
            completed: false,
            createdBy: user,
            createdAt: new Date(),
          })
          .then(() => {
            console.log("Todo successfully Created!");
            setBucketName("");
            setTodo("");
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
      }
    } else {
      setError("Set Title and Bucket Name");
    }
  };
  return (
    <Modal
      className="primary-color"
      size="tiny"
      centered={false}
      open={open.status}
      onClose={() => setOpen({ status: false, modal: null })}
    >
      {open.modal === "todo" ? (
        <>
          <Modal.Header className="primary-color">
            {open.edit ? "Update" : "Create"} To-Do
          </Modal.Header>
          <Modal.Content className="primary-color">
            <Modal.Description>
              <Form>
                <Form.Field>
                  <label className="inputLable">Title</label>
                  <input
                    className="inputBox"
                    placeholder="To-Do Title"
                    defaultValue={open.data?.todo}
                    value={todo}
                    onChange={(e) => {
                      setTodo(e.target.value);
                      setError(null);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label className="inputLable">Bucket Name</label>
                  <input
                    className="inputBox"
                    placeholder="Bucket Name"
                    defaultValue={open.data?.bucketName}
                    value={bucketName}
                    onChange={(e) => {
                      setBucketName(e.target.value);
                      setError(null);
                    }}
                  />
                </Form.Field>
              </Form>
              {!open.edit && (
                <div className="suggestionBox">
                  <label className="inputLable">Suggestion Buckets:</label>
                  {suggestions && suggestions.length > 0 ? (
                    suggestions.map((bucket, index) => {
                      return (
                        <Label
                          className="suggestionLable"
                          color="purple"
                          key={index}
                          onClick={(e) => setBucketName(bucket.name)}
                        >
                          {bucket.name}
                        </Label>
                      );
                    })
                  ) : (
                    <Label
                      className="suggestionLable"
                      color="purple"
                      onClick={() => setBucketName("Primary")}
                    >
                      Primary
                    </Label>
                  )}
                </div>
              )}
              <div className="error"> {error ? error : ""}</div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions className="primary-color">
            <Button
              onClick={() => {
                setBucketName("");
                setTodo("");
                dispatch(
                  bucketListActions.modal({
                    status: false,
                    modal: "close",
                    edit: false,
                    data: null,
                  })
                );
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => createTodo()}>
              {open.edit ? "Update" : "Create"}
            </Button>
          </Modal.Actions>
        </>
      ) : (
        <>
          <Modal.Header className="primary-color">Create Bucket</Modal.Header>
          <Modal.Content className="primary-color">
            <Modal.Description>
              <Form>
                <Form.Field>
                  <label className="inputLable">Bucket Name</label>
                  <input
                    className="inputBox"
                    placeholder="Bucket Name"
                    value={bucketName}
                    onChange={(e) => {
                      setBucketName(e.target.value);
                      setError(null);
                    }}
                  />
                </Form.Field>
              </Form>
              <div className="error"> {error ? error : ""}</div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions className="primary-color">
            <Button
              onClick={() => {
                setBucketName("");
                setTodo("");
                dispatch(
                  bucketListActions.modal({
                    status: false,
                    modal: "close",
                    edit: false,
                    data: null,
                  })
                );
              }}
            >
              Cancel
            </Button>
            <Button onClick={createBucket}>Create</Button>
          </Modal.Actions>
        </>
      )}
    </Modal>
  );
};

export default AddModal;
