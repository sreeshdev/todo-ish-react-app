import React from "react";
import { Header, Icon, Table } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { bucketListActions } from "../../_actions";

const TableData = ({ todoList, completeTodo, deleteTodo, from }) => {
  const dispatch = useDispatch();
  return todoList?.length > 0 ? (
    <Table celled inverted structured>
      <Table.Header>
        {from === "recents" && (
          <Table.Row>
            <Table.HeaderCell colSpan="6" textAlign="center">
              <Header.Content as="h3">Recents</Header.Content>
            </Table.HeaderCell>
          </Table.Row>
        )}
        <Table.Row>
          <Table.HeaderCell rowSpan="2" textAlign="center">
            Todo
          </Table.HeaderCell>
          <Table.HeaderCell rowSpan="2" textAlign="center">
            Bucket
          </Table.HeaderCell>
          <Table.HeaderCell colSpan="2" textAlign="center">
            Action
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell textAlign="center">Edit/Delete</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Status</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {todoList.map((todo) => {
          return (
            <Table.Row
              key={todo.id}
              inverted
              //   positive={todo.completed ? true : false}
              //   negative={todo.completed ? false : true}
            >
              <Table.Cell textAlign="center">{todo.title}</Table.Cell>
              <Table.Cell textAlign="center">{todo.bucket}</Table.Cell>
              <Table.Cell textAlign="center">
                <div className="edit-cell">
                  <Icon
                    style={{ cursor: "pointer" }}
                    color="white"
                    name="edit"
                    onClick={() =>
                      dispatch(
                        bucketListActions.modal({
                          status: true,
                          modal: "todo",
                          edit: true,
                          data: {
                            todo: todo.title,
                            bucketName: todo.bucket,
                            id: todo.id,
                          },
                        })
                      )
                    }
                  />
                  <Icon
                    style={{ cursor: "pointer" }}
                    color="white"
                    name="trash alternate outline"
                    onClick={() => deleteTodo(todo.id)}
                  />
                </div>
              </Table.Cell>
              <Table.Cell textAlign="center">
                <Icon
                  style={{ cursor: "pointer" }}
                  color={todo.completed ? "green" : "red"}
                  name={todo.completed ? "check square" : "window close"}
                  size="large"
                  onClick={() => completeTodo(todo.id, todo.completed)}
                />

                {todo.completed ? "Done" : "Not yet"}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  ) : (
    <div className="no-data">No To-Do added</div>
  );
};

export default TableData;
