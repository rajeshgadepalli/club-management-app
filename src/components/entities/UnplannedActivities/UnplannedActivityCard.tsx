import React from "react";
import { View } from "react-native";
import {
  Card,
  Text,
  TouchableRipple,
} from "react-native-paper";
import {
  CalendarDays,
  Clock,
  MessageSquareText,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

import { COLORS } from "@/theme";
import { appStyles } from "@/theme/styles.new";
import { UnplannedActivityLite } from "@/types/unplannedActivity";
import { formatDate, formatTime } from "@/utils/dateUtils";
import { getFullName } from "@/utils/formatters";

interface Props {
  activity: UnplannedActivityLite;
}

export default function UnplannedActivityCard({ activity }: Props) {
  const navigation = useNavigation();

  const handleEdit = () => {
    navigation.navigate("UnplannedActivityForm", {
      activity: { id: activity.id },
    });
  };

  return (
    <Card style={appStyles.card}>
      <TouchableRipple onPress={handleEdit} rippleColor={COLORS.border}>
        <View style={[appStyles.cardContent, appStyles.gap]}>
          {/* Header: Name + Subordinate */}
          <View style={appStyles.gapSm}>
            <Text variant="titleMedium">
              {getFullName(activity.firstName, activity.lastName)}
            </Text>
            {activity.subordinateUserFirstName && (
              <Text variant="bodyMedium" style={appStyles.textSecondary}>
                {getFullName(
                  activity.subordinateUserFirstName,
                  activity.subordinateUserLastName
                )}
              </Text>
            )}
          </View>

          {/* Date & Time & Comments */}
          <View style={appStyles.gapSm}>
            <View style={[appStyles.row, appStyles.gapSm]}>
              <CalendarDays size={18} color={COLORS.primary} />
              <Text variant="bodyMedium">{formatDate(activity.activityDate)}</Text>
            </View>

            <View style={[appStyles.row, appStyles.gapSm]}>
              <Clock size={18} color={COLORS.primary} />
              <Text variant="bodyMedium">{formatTime(activity.fromTime)}</Text>
            </View>

            {!!activity.comments && (
              <View style={[appStyles.row, appStyles.gapSm]}>
                <MessageSquareText size={18} color={COLORS.primary} />
                <Text variant="bodyMedium" numberOfLines={2}>
                  {activity.comments}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableRipple>
    </Card>
  );
}
