import dayjs from "dayjs";
import React, { useEffect, useState, useCallback } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import deleteIcon from "../../assets/images/icon-delete.svg";
import emptyItem from "../../assets/images/empty-activity.png";
import ModalDelete from "../Modals/ModalDelete";
import ModalToast from "../Modals/ModalToast";
import { Creators as TodoActions } from "../../redux/TodoRedux";
import "dayjs/locale/id";

function DashboardModule() {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    dataGetActivities,
    errGetActivities,
    isLoadingGetActivities,
    dataAddActivity,
    errAddActivity,
    dataDeleteActivity,
    errDeleteActivity,
    isLoadingAddActivity,
  } = useSelector((state) => state.todo);

  // State
  const [showDelete, setShowDelete] = useState(false);
  const [modalText, setModalText] = useState("Activity berhasil dihapus");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("danger");
  const [deletedActivity, setDeletedActivity] = useState("");

  // Action creators
  const getActivities = useCallback(() => 
    dispatch(TodoActions.getActivitiesRequest()), [dispatch]);
    
  const addActivity = useCallback((data) => 
    dispatch(TodoActions.addActivityRequest(data)), [dispatch]);
    
  const resetState = useCallback(() => 
    dispatch(TodoActions.resetStateTodo()), [dispatch]);

  // Effects
  useEffect(() => {
    getActivities();
  }, [getActivities]);

  useEffect(() => {
    if (errAddActivity !== null) {
      setShowToast(true);
      setToastType("danger");
      setModalText(errAddActivity || "Gagal menambahkan activity");
      resetState();
    }
    if (dataAddActivity) {
      getActivities();
      resetState();
    }
  }, [errAddActivity, dataAddActivity, getActivities, resetState]);

  useEffect(() => {
    if (errGetActivities !== null) {
      setShowToast(true);
      setToastType("danger");
      setModalText(errGetActivities || "Terjadi kesalahan. Gagal memuat list activity");
      resetState();
    }
  }, [errGetActivities, resetState]);

  useEffect(() => {
    if (errDeleteActivity !== null) {
      setShowToast(true);
      setToastType("danger");
      setModalText(errDeleteActivity || "Gagal menghapus activity");
      resetState();
    }
    if (dataDeleteActivity) {
      getActivities();
      setShowToast(true);
      setToastType("success");
      setModalText("Activity berhasil dihapus");
      resetState();
    }
  }, [errDeleteActivity, dataDeleteActivity, getActivities, resetState]);

  // Handlers
  const handleAddActivity = () => {
    addActivity({ title: "New Activity", email: "mail.yanafriyoko@gmail.com" });
  };

  const handleClickDelete = (item) => {
    setShowDelete(true);
    setModalText(
      `<p>Apakah anda yakin menghapus activity <strong>"${item?.title}"</strong>?</p>`
    );
    setDeletedActivity(item?.id);
  };

  const handleCloseDeleteModal = () => setShowDelete(false);
  const handleCloseToast = () => setShowToast(false);

  // Render helpers
  const renderEmptyState = () => (
    <div className="empty-item" data-cy="activity-empty-state">
      <img src={emptyItem} alt="empty" onClick={handleAddActivity} />
    </div>
  );

  const renderActivityCard = (item, key) => (
    <div key={item?.id} className="col-3">
      <div className="activity-card" data-cy="activity-item" id={`itemTodo${key}`}>
        <div
          className="activity-body"
          onClick={() => history.push(`/detail/${item?.id}`)}
        >
          <h4 data-cy="activity-item-title">{item?.title}</h4>
        </div>
        <div className="card-footer">
          <span data-cy="activity-item-date">
            {dayjs(item?.created_at)
              .locale("id")
              .format("DD MMMM YYYY")}
          </span>
          <img
            src={deleteIcon}
            onClick={() => handleClickDelete(item)}
            alt="delete"
            data-cy="activity-item-delete-button"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="todo-header">
        <h1 data-cy="activity-title">Activity</h1>
        <button 
          className="btn btn-primary" 
          data-cy="activity-add-button" 
          onClick={handleAddActivity}
          disabled={isLoadingAddActivity}
        >
          {isLoadingAddActivity ? (
            <Spinner
              as="span"
              animation="border"
              size="md"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <>
              <span className="icon-plus"></span> {"Tambah"}
            </>
          )}
        </button>
      </div>
      <div className="dashboard-content">
        {isLoadingGetActivities ? (
          <div className="spinner-wrapper">
            <Spinner
              as="span"
              animation="border"
              size="lg"
              role="status"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="row">
            {dataGetActivities?.data?.length < 1 && renderEmptyState()}
            {dataGetActivities?.data?.map(renderActivityCard)}
          </div>
        )}
      </div>
      <ModalDelete
        text={modalText}
        show={showDelete}
        deletedItem={deletedActivity}
        handleClose={handleCloseDeleteModal}
      />
      <ModalToast
        type={toastType}
        text={modalText}
        show={showToast}
        handleClose={handleCloseToast}
      />
    </div>
  );
}

export default DashboardModule;