import { StyleSheet, Platform } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from './index';

export const appStyles = StyleSheet.create({
  // =============================================================================
  // Base Layout Patterns
  // =============================================================================
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  containerFluid: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  col: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gap: {
    gap: SPACING.md,
  },
  gapSm: {
    gap: SPACING.sm,
  },
  gapLg: {
    gap: SPACING.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },

  // =============================================================================
  // List Patterns
  // =============================================================================
  listContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listHeader: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    padding: SPACING.md,
  },
  listContent: {
    padding: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  loadingContainer: {
    padding: SPACING.md,
  },

  // =============================================================================
  // Screen Patterns
  // =============================================================================
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // =============================================================================
  // Form Patterns
  // =============================================================================
  formScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  formScrollView: {
    flex: 1,
    marginBottom: 80,
  },
  formScrollContent: {
    padding: SPACING.md,
  },
  formContainer: {
    padding: SPACING.md,
  },
  formSection: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: 8,
  },
  formGroup: {
    marginBottom: SPACING.sm,
  },
  formSectionTitle: {
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  error: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: SPACING.xs,
  },
  errorText: {
    color: COLORS.error,
    marginTop: SPACING.xs,
    fontSize: 12,
  },
  buttonContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 4, // Add shadow for Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'space-between'
  },

  // =============================================================================
  // Header Patterns
  // =============================================================================
  pageHeader: {
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.md,
  },
  pageHeaderTitle: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
  pageHeaderSubtitle: {
    color: COLORS.background,
    marginTop: SPACING.xs,
  },

  // =============================================================================
  // Dashboard Patterns
  // =============================================================================
  dashboardSection: {
    flexDirection: 'row',
    padding: SPACING.md,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dashboardItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  dashboardTime: {
    color: COLORS.primary,
    marginVertical: SPACING.xs,
  },
  dashboardSegment: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },

  // =============================================================================
  // Card Patterns
  // =============================================================================
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cardContent: {
    gap: SPACING.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },

  // =============================================================================
  // Filter Modal Patterns
  // =============================================================================
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModalContainer: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.md,
  },
  filterModalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  filterModalChildrenContainer: {
    marginTop: SPACING.md,
  },
  filterModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },

  // =============================================================================
  // Modal Patterns
  // =============================================================================
  modalFullscreen: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: COLORS.background,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  modalContent: {
    flex: 1,
    padding: SPACING.sm,
  },

  // =============================================================================
  // Button Patterns
  // =============================================================================
  // button: {
  //   marginVertical: SPACING.sm,
  //   borderRadius: 24,
  // },
  fab: {
    position: 'absolute',
    margin: SPACING.md,
    right: 0,
    bottom: 0,
  },

  // =============================================================================
  // Image Patterns
  // =============================================================================
  imageContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: SPACING.xs,
  },
  imagePreviewContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.sm,
    marginTop: SPACING.xs,
  },
  imagePreviewAadhaar: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: SPACING.xs,
  },
  imagePreviewAadhaarContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.sm,
    marginTop: SPACING.xs,
  },

  // =============================================================================
  // Typography Styles
  // =============================================================================
  textSecondary: {
    color: COLORS.disabled,
    marginTop: 2,
  },
  textLight: {
    color: '#FFFFFF',
  },

  textRedMediumBold: {
    color: 'red',
    fontWeight: '500', // medium-bold
  },
  

  // =============================================================================
  // Common UI Elements
  // =============================================================================
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
  },
  statusChip: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: SPACING.xs,
  },
  chipPrimary: {
    borderRadius: 16,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primary,
    marginTop: SPACING.xs,
    alignSelf: 'flex-start',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  skeleton: {
    backgroundColor: '#E1E9EE',  // Light gray color for skeleton loading
    borderRadius: 4,
  },
});
