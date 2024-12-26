import { invoke } from "@tauri-apps/api/core";



export const fetchTodayBillsStats = async () => {
  try {
    const stats = await invoke('get_bills_today');
    return stats;
  } catch (error) {
    console.error('Error fetching today bills stats:', error);
    throw error;
  }
};

export const fetchTodayCaseBillsStats = async () => {
  try {
    const stats = await invoke('get_case_bills_today');
    return stats;
  } catch (error) {
    console.error('Error fetching case bills stats:', error);
    throw error;
  }
};


export const fetchBillsStats = async () => {
  try {
    const stats = await invoke('get_total_bills');
    return stats;
  } catch (error) {
    console.error('Error fetching bills stats:', error);
    throw error;
  }
};

export const fetchCaseBillsStats = async () => {
  try {
    const stats = await invoke('get_total_case_bills');
    return stats;
  } catch (error) {
    console.error('Error fetching case bills stats:', error);
    throw error;
  }
};
