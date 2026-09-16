import { ID, Query } from "appwrite";
import {
  DB_ID,
  DEPARTMENT_TABLE_ID,
  LEAVE_TABLE_ID,
  NOTIFICATION_TABLE_ID,
  tablesDB,
  USER_TABLE_ID,
} from "../appwriteConfig";

export const listRows = (tableId, queries = []) =>
  tablesDB.listRows(DB_ID, tableId, queries);

export const explainAppwriteError = (error, fallback) => {
  if (!error) return fallback;
  if (error.code === 401 || error.code === 403) {
    return `${fallback} Appwrite permission denied (${error.code}). Check table permissions for the signed-in user.`;
  }
  if (error.code === 404) {
    return `${fallback} Appwrite resource not found (${error.code}). Check database/table IDs in .env.`;
  }
  return error.message || fallback;
};

export const listUsers = () => listRows(USER_TABLE_ID, [Query.limit(500)]);
export const listDepartments = () =>
  listRows(DEPARTMENT_TABLE_ID, [Query.orderAsc("name"), Query.limit(500)]);

export const listLeaves = (queries = []) =>
  listRows(LEAVE_TABLE_ID, [Query.limit(500), ...queries]);

export const createLeave = (data) => {
  const supportedData = { ...data };
  delete supportedData.days;
  Object.keys(supportedData).forEach((key) => {
    if (supportedData[key] === null || supportedData[key] === undefined) {
      delete supportedData[key];
    }
  });
  return tablesDB.createRow(DB_ID, LEAVE_TABLE_ID, ID.unique(), supportedData);
};

export const createNotification = (data) =>
  tablesDB.createRow(DB_ID, NOTIFICATION_TABLE_ID, ID.unique(), {
    read: false,
    created_at: new Date().toISOString(),
    ...data,
  });

export const updateUser = (id, data) =>
  tablesDB.updateRow(
    DB_ID,
    USER_TABLE_ID,
    id,
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== null && value !== undefined)
    )
  );

export const updateLeave = (id, data) =>
  tablesDB.updateRow(
    DB_ID,
    LEAVE_TABLE_ID,
    id,
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== null && value !== undefined)
    )
  );
