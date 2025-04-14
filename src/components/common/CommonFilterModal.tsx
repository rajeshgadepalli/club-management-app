import React, { useState, useEffect } from "react";
import { View, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Text, Button } from "react-native-paper";
import DatePickerInput from "./CustomDatePicker";
import CustomDropdown from "./CustomDropdown";
import { FilterFieldsConfig, LabelValue } from "@/types/core";
import { appStyles } from "@/theme/styles.new";
import { convertToISTDate } from '@/utils/dateUtils';

interface CommonFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: { [key: string]: any }) => void;
  filterFieldsConfig: FilterFieldsConfig[];
  children: React.ReactNode;
}

const predefinedRanges: LabelValue[] = [
  { label: "Last Month", value: "lastMonth" },
  { label: "Last 7 Days", value: "last7Days" },
  { label: "Custom", value: "custom" },
];

const CommonFilterModal: React.FC<CommonFilterModalProps> = ({
  visible,
  onClose,
  onApplyFilter,
  filterFieldsConfig,
  children,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("last7Days");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [filtersState, setFiltersState] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const today = new Date();
    let newFromDate: Date | null = null;
    let newToDate: Date | null = null;

    switch (selectedOption) {
      case "currentMonth":
        newFromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        newToDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "lastMonth":
        newFromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        newToDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "last7Days":
        newFromDate = new Date(today);
        newFromDate.setDate(today.getDate() - 6);
        newToDate = today;
        break;
      default:
        newFromDate = null;
        newToDate = null;
    }

    if (selectedOption !== "custom") {
      setFromDate(newFromDate);
      setToDate(newToDate);
    }
  }, [selectedOption, visible]);

  const handleApplyFilter = () => {
    const filters: { [key: string]: any } = {
      fromDate: fromDate ? convertToISTDate(fromDate) : undefined,
      toDate: toDate ? convertToISTDate(toDate) : undefined,
    };

    filterFieldsConfig.forEach((config) => {
      if (config.returnKey && filtersState[config.label]) {
        filters[config.returnKey] = filtersState[config.label];
      }
    });

    if (fromDate && toDate && fromDate > toDate) {
      // console.error("From date should be less than to date.");
    } else {
      onApplyFilter(filters);
    }
    setSelectedOption("last7Days");
    setFiltersState({});
  };

  const handleClearFilter = () => {
    const today = new Date();
    setFromDate(today);
    setToDate(today);
    setFiltersState({});
    setSelectedOption("last7Days");
    onApplyFilter({});
  };

  const handleFilterChange = (label: string, value: string) => {
    setFiltersState((prevState) => ({ ...prevState, [label]: value }));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity
        style={appStyles.filterModalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity style={appStyles.filterModalContainer} activeOpacity={1}>
          <View style={appStyles.filterModalHeader}>
            <Text variant="titleLarge" style={appStyles.filterModalTitle}>
              Filters
            </Text>
            <Button mode="text" onPress={handleClearFilter}>
              Clear Filter
            </Button>
          </View>
          <ScrollView>
            {filterFieldsConfig.map((fieldConfig, index) => {
              if (fieldConfig.type === "dropdown") {
                return (
                  <CustomDropdown
                    key={index}
                    label={fieldConfig.label}
                    value={filtersState[fieldConfig.label] || ""}
                    onChange={(value) =>
                      handleFilterChange(fieldConfig.label, value)
                    }
                    options={fieldConfig.options || []}
                  />
                );
              } else if (
                fieldConfig.label === "Date Dropdown" &&
                fieldConfig.value
              ) {
                return (
                  <View key={index}>
                    <CustomDropdown
                      key={index}
                      label="Select Date Range"
                      value={selectedOption}
                      onChange={setSelectedOption}
                      options={predefinedRanges}
                    />
                    <DatePickerInput
                      label="From Date"
                      value={fromDate as Date}
                      onChange={setFromDate}
                    />
                    <DatePickerInput
                      label="To Date"
                      value={toDate as Date}
                      onChange={setToDate}
                    />
                  </View>
                );
              }
            })}
            <View style={appStyles.filterModalChildrenContainer}>{children}</View>
          </ScrollView>
          <View style={appStyles.filterModalFooter}>
            <Button 
              mode="outlined" 
              onPress={onClose}
              style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleApplyFilter}
              style={{ flex: 1 }}>
              Apply Filter
            </Button>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default CommonFilterModal;
