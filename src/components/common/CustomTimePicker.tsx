import React, { useState } from "react";
import { View, Platform } from "react-native";
import { Button, HelperText } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatTime } from "@/utils/dateUtils";

interface TimePickerInputProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  mode?: "time" | "date" | "datetime";
}

const DatePickerInput = ({
  label,
  value,
  onChange,
  error,
}: TimePickerInputProps) => {
  const [show, setShow] = useState(false);

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View>
      <Button
        mode="outlined"
        onPress={() => setShow(true)}
      >
        {label}: {value ? formatTime(value) : "Select Time"}
      </Button>

      {error && <HelperText type="error">{error}</HelperText>}

      {show && (
        <DateTimePicker
          value={value instanceof Date ? value : new Date()}
          mode="time"
          onChange={onDateChange}
          display={Platform.OS === "ios" ? "spinner" : "default"}
        />
      )}
    </View>
  );
};

export default DatePickerInput;
