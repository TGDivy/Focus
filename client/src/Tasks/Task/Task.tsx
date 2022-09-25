import { Delete, Edit, Save } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  ClickAwayListener,
  Collapse,
  Grid,
  IconButton,
} from "@mui/material";
import React, { useState, FC } from "react";

import Description from "./Description";
import Priority from "./Priority";
import StartTimer from "./StartTimer";
import SubTaskList from "./SubTaskList";
import Tags from "./Tags";
import Title from "./Title";
import { taskType, priorityType } from "../../Stores/Types";

import useTaskStore from "../../Stores/TaskStore";

interface taskFC extends taskType {
  id: string;
  createNewTask: boolean;
  alwaysExpanded?: boolean;
  startTimerButton?: boolean;
}

const Task: FC<taskFC> = (props) => {
  const addTask = useTaskStore((state) => state.addTask);
  const editTask = useTaskStore((state) => state.editTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const [expanded, setExpanded] = useState(props.alwaysExpanded);
  const [subtasks_, setSubtasks] = useState(props.subTasks);

  const [editing, setEditing] = useState(props.createNewTask);
  const [title_, setTitle] = useState(props.title);
  const [description_, setDescription] = useState(props.description);
  const [priority_, setPriority] = useState(props.priority);
  const [tags_, setTags] = useState(props.tags);
  const [completed_, setCompleted] = useState(props.completed);

  const handleEdit = () => {
    setEditing(true);
    setExpanded(true);
  };

  const handleSave = () => {
    console.log("Saving...");
    if (props.createNewTask) {
      addTask(
        {
          taskListName: props.taskListName,
          title: title_,
          description: description_,
          priority: priority_,
          subTasks: subtasks_,
          tags: tags_,
          completed: completed_,
          dueDate: new Date(),
        },
        props.id
      );
      if (!props.alwaysExpanded) setExpanded(false);
      setCompleted(false);
      setTitle("Create Task");
      setDescription("");
      setPriority(priorityType.Medium);
      setSubtasks([]);
      setTags([]);
    } else {
      setEditing(false);
      editTask(
        {
          taskListName: props.taskListName,
          title: title_,
          description: description_,
          priority: priority_,
          subTasks: subtasks_,
          tags: tags_,
          completed: completed_,
          dueDate: new Date(),
        },
        props.id
      );
    }
  };

  const handleTaskComplete = () => {
    if (!props.createNewTask) {
      console.log("completing", completed_);
      editTask(
        {
          taskListName: props.taskListName,
          title: title_,
          description: description_,
          priority: priority_,
          subTasks: subtasks_.map((subTask) => [subTask[0], true]),
          tags: tags_,
          completed: !completed_,
          dueDate: new Date(),
        },
        props.id
      );
      console.log("Task Completed", completed_);
      if (!completed_) {
        setSubtasks(subtasks_.map((subTask) => [subTask[0], true]));
      }
      setCompleted(!completed_);
    }
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (!props.alwaysExpanded) setExpanded(false);
        if (!props.createNewTask) {
          setEditing(false);
        }
      }}
    >
      <Card
        sx={{
          ":hover": {
            boxShadow: 20,
          },
        }}
        onClick={() => {
          setExpanded(true);
        }}
      >
        <CardHeader
          title={
            <Title
              title={title_}
              editing={editing}
              setTitle={setTitle}
              completed={completed_}
              handleTaskComplete={handleTaskComplete}
            />
          }
          action={
            (editing && (
              <IconButton aria-label="save" onClick={handleSave}>
                <Save />
              </IconButton>
            )) || (
              <IconButton aria-label="edit" onClick={handleEdit}>
                <Edit />
              </IconButton>
            )
          }
        />
        <CardContent sx={{ padding: "5px 20px 5px 20px" }}>
          <Tags tags={tags_} editing={editing} setTags={setTags} />
        </CardContent>
        <CardActions>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={1}>
              <Priority
                priority={priority_}
                editing={editing}
                setPriority={setPriority}
              />
            </Grid>
            <Grid item xs={6}>
              {props.startTimerButton && !editing && (
                <StartTimer id={props.id} />
              )}
              {!props.createNewTask && editing && (
                <Button
                  aria-label="delete"
                  onClick={() => {
                    deleteTask(props.id);
                  }}
                  fullWidth
                  variant="contained"
                  size="small"
                >
                  <Delete />
                </Button>
              )}
            </Grid>
          </Grid>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent
            sx={{
              marginTop: 0,
              marginBottom: 0,
              paddingTop: 0,
              "&:last-child": {
                paddingBottom: 1,
              },
            }}
          >
            <SubTaskList
              subTasks={subtasks_}
              setSubTasks={setSubtasks}
              handleSave={handleSave}
              editing={editing}
            />
            <Description
              description={description_}
              editing={editing}
              setDescription={setDescription}
            />
          </CardContent>
        </Collapse>
      </Card>
    </ClickAwayListener>
  );
};

export default Task;
