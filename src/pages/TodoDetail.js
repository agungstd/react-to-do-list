import React, { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { titlePage } from "../lib/titleHead";
import { Creators as TodoActions } from "../redux/TodoRedux";

const TodoDetailModule = lazy(() => import("../components/TodoDetail/TodoDetailModule"));
const Header = lazy(() => import("../layout/Header"));

function TodoDetail() {
  const { todoId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    titlePage({ title: "To Do List - Detail" });
    dispatch(TodoActions.getActivityDetailRequest(todoId));
  }, [dispatch, todoId]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Header />
      <TodoDetailModule />
    </Suspense>
  );
}

export default TodoDetail;
