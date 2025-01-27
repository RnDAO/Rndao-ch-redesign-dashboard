import React from "react";
import {
	Box,
	Button,
	Chip,
	Grid,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FaCaretUp } from "react-icons/fa";
import { FaHashtag } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";

import TcCommunityPlatformIcon from "@/components/communitySettings/communityPlatforms/TcCommunityPlatformIcon";

import { useSnackbar } from "@/context/SnackbarContext";
import { useToken } from "@/context/TokenContext";
import {
	setAmplitudeUserIdFromToken,
	trackAmplitudeEvent,
} from "@/helpers/amplitudeHelper";
import { defaultLayout } from "@/layouts/defaultLayout";

const DATA_SOURCES = [
	{ title: "Discord", isComingSoon: false },
	{ title: "Github", isComingSoon: false },
	{ title: "Discourse", isComingSoon: false },
	{ title: "Notion", isComingSoon: false },
	{ title: "MediaWiki", isComingSoon: false },
	{ title: "Telegram", isComingSoon: false },
	{ title: "X", isComingSoon: true },
	{ title: "Snapshot", isComingSoon: true },
	{ title: "Google", isComingSoon: true },
	{ title: "Gitbook", isComingSoon: true },
];

const APPLICATION_MARKETPLACES = [
	{
		icon: <IoStatsChart />,
		title: "Analytics",
		description:
			"Master your community's engagement with detailed insights. Monitor active vs. inactive members, track participation across user groups, and identify your most valuable contributors.",
		isManageable: true,
		isOpenable: true,
	},
	{
		icon: <IoStatsChart />,
		title: "Announcements",
		description:
			"Take control of your announcements and communication to members. Send targeted messages to specific types of member based on their roles or engagement levels.",
		isManageable: false,
		isOpenable: true,
	},
	{
		icon: <IoStatsChart />,
		title: "Ai Assistance",
		description:
			"24/7 support for your community. Our AI assistant uses your connected data sources to answer member questions instantly, freeing you to focus on strategic tasks while ensuring consistent, reliable member support.",
		isManageable: true,
		isOpenable: false,
	},
	{
		icon: <FaHashtag />,
		title: "Reputation",
		description:
			"Create a culture of genuine participation with our intelligent Reputation Score system. Automatically measure authentic community involvement, while ensuring the system remains fair and resistant to manipulation.",
		isManageable: true,
		isOpenable: true,
	},
	{
		icon: <IoStatsChart />,
		title: "Violation Detection",
		description:
			"Keep your community safe with intelligent automation. Our system detects and handles violations according to your preferences. Maintain standards without constant surveillance.",
		isManageable: true,
		isOpenable: false,
	},
	{
		icon: <IoStatsChart />,
		title: "Coming Soon",
		description:
			"Be part of something bigger. Vote on upcoming features and shape our roadmap. Your input directly influences our development priorities, ensuring we build what matters most to you.",
		isManageable: false,
		isOpenable: false,
	},
];

interface IDataSources {
	title: string;
	isComingSoon: boolean;
}

function Welcome() {
	const router = useRouter();
	const { community } = useToken();
	const { showMessage } = useSnackbar();

	const platformNames =
		community?.platforms?.map((platform) => platform.name) || [];

	const handleUpvote = (dataSource: string) => () => {
		try {
			setAmplitudeUserIdFromToken();

			trackAmplitudeEvent({
				eventType: "Upvote Data Source",
				eventProperties: {
					communityId: community?.id,
					communityName: community?.name,
					platform: dataSource,
				},
			});
			showMessage(
				`Thank you for upvoting ${dataSource}! We will consider adding it soon.`,
				"success",
			);
		} catch (e) {
			console.error(e);
		}
	};

	const handleConnectPlatform = (dataSource: IDataSources) => () => {
		router.push(
			`/community-settings/?managePlatform=${dataSource.title.toLocaleLowerCase()}`,
		);

		setAmplitudeUserIdFromToken();

		trackAmplitudeEvent({
			eventType: "Connect Data Source",
			eventProperties: {
				communityId: community?.id,
				communityName: community?.name,
				platform: dataSource.title,
			},
		});
	};

	const handleManagePlatform = (dataSource: IDataSources) => () => {
		router.push(
			`/community-settings/?addPlatform=${dataSource.title.toLocaleLowerCase()}`,
		);

		setAmplitudeUserIdFromToken();

		trackAmplitudeEvent({
			eventType: "Manage Data Source",
			eventProperties: {
				communityId: community?.id,
				communityName: community?.name,
				platform: dataSource.title,
			},
		});
	};

	const handleOpenApplication = (application: string) => () => {
		switch (application) {
			case "Analytics":
				router.push("/");
				break;
			case "Announcements":
				router.push("/announcements");
				break;
			case "Ai Assistance":
				router.push("/community-settings/ai-assistant/");
				break;
			case "Reputation":
				router.push("/reputation-score/");
				break;
			case "Violation Detection":
				router.push("/community-settings/violation-detection/");
				break;
			case "Coming Soon":
				showMessage("This application is coming soon!", "info");
				break;
			default:
				break;
		}
	};

	const handleManageApplication = (application: string) => () => {
		switch (application) {
			case "Analytics":
				router.push("/community-settings/");
				break;
			case "Announcements":
				router.push("/announcements");
				break;
			case "Ai Assistance":
				router.push("/community-settings/ai-assistant/");
				break;
			case "Reputation":
				router.push("/community-settings/reputation-score/");
				break;
			case "Violation Detection":
				router.push("/community-settings/violation-detection/");
				break;
			case "Coming Soon":
				showMessage("This application is coming soon!", "info");
				break;
			default:
				break;
		}
	};

	return (
		<Grid
			container
			direction="row"
			sx={{
				mx: "auto",
				px: {
					xs: 2,
					md: 12,
				},
				gap: 1,
			}}
		>
			<Grid item xs={12}>
				<Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
					Welcome to <b>{community?.name}</b>
				</Typography>
			</Grid>
			<Grid container direction="row" spacing={2}>
				<Grid
					item
					xs={12}
					md={6}
					sx={{
						borderRight: (theme) => {
							return {
								xs: "none",
								md: `1px solid ${theme.palette.grey[300]}`,
							};
						},
					}}
					pr={{
						md: 2,
					}}
				>
					<Paper
						elevation={0}
						sx={{
							maxWidth: 120,
							backgroundColor: (theme) => theme.palette.grey[200],
							px: 1,
							py: 1,
							textAlign: "center",
							borderRadius: 2,
						}}
					>
						<Typography variant="body1" fontWeight="500">
							Data Source
						</Typography>
					</Paper>
					<List>
						{DATA_SOURCES.map((dataSource) => {
							const isConnected = platformNames.includes(
								dataSource.title.toLowerCase(),
							);

							return (
								<ListItem
									key={dataSource.title}
									sx={{
										boxShadow: 1,
										mt: 1,
										borderRadius: 2,
									}}
								>
									<ListItemIcon
										sx={{
											minWidth: 40,
										}}
									>
										<TcCommunityPlatformIcon
											platform={dataSource.title}
											size={19}
										/>
									</ListItemIcon>
									<ListItemText
										sx={{
											flex: "1 1 auto",
											gap: 1,
											alignItems: "center",
										}}
									>
										{dataSource.title === "Google"
											? "GDrive"
											: dataSource.title}
										{dataSource.isComingSoon && (
											<Chip
												label="Soon"
												size="small"
												sx={{
													ml: 1,
												}}
											/>
										)}
									</ListItemText>
									<Stack
										sx={{
											padding: 0,
											display: "flex",
											justifyContent: "end",
										}}
									>
										{dataSource.isComingSoon ? (
											<Button
												variant="outlined"
												sx={{
													minWidth: {
														xs: "auto",
														md: 120,
													},
												}}
												startIcon={<FaCaretUp />}
												onClick={handleUpvote(dataSource.title)}
											>
												Upvote
											</Button>
										) : (
											<Button
												variant={isConnected ? "outlined" : "contained"}
												sx={{
													minWidth: {
														xs: "auto",
														md: 120,
													},
												}}
												disableElevation
												onClick={
													isConnected
														? handleConnectPlatform(dataSource)
														: handleManagePlatform(dataSource)
												}
											>
												{isConnected ? "Manage" : "Add"}
											</Button>
										)}
									</Stack>
								</ListItem>
							);
						})}
					</List>
				</Grid>

				<Grid item xs={12} md={6}>
					<Paper
						elevation={0}
						sx={{
							maxWidth: 200,
							backgroundColor: (theme) => theme.palette.grey[200],
							px: 1,
							py: 1,
							textAlign: "center",
							borderRadius: 2,
						}}
					>
						<Typography variant="body1" fontWeight="500">
							Application Marketplace
						</Typography>
					</Paper>
					<Grid container direction="row" spacing={2} mt={1}>
						{APPLICATION_MARKETPLACES.map((application) => (
							<Grid item xs={12} md={6} key={application.title}>
								<Paper
									elevation={0}
									sx={{
										minWidth: "100%",
										maxWidth: 120,
										px: 1,
										py: 1,
										boxShadow: 1,
										borderRadius: 2,
									}}
									className="space-y-3"
								>
									<Stack direction="row" alignItems="center" gap={1}>
										<Box>{application.icon}</Box>
										<Typography variant="body1" fontWeight="600">
											{application.title}
										</Typography>
									</Stack>
									<Typography variant="body2" color="GrayText">
										{application.description}
									</Typography>
									<Stack direction="row" gap={1}>
										{application.isOpenable && (
											<Button
												variant="contained"
												fullWidth
												disableElevation
												onClick={handleOpenApplication(application.title)}
											>
												Open
											</Button>
										)}
										{application.isManageable && (
											<Button
												variant="outlined"
												fullWidth
												disableElevation
												onClick={handleManageApplication(application.title)}
											>
												Manage
											</Button>
										)}
									</Stack>
									{!application.isOpenable && !application.isManageable && (
										<Button
											variant="outlined"
											fullWidth
											disableElevation
											disabled
										>
											Apply
										</Button>
									)}
								</Paper>
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}

Welcome.pageLayout = defaultLayout;

export default Welcome;
