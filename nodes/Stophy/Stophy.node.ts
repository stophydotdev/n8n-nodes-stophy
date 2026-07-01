import {
	type INodeType,
	type INodeTypeDescription,
	NodeConnectionTypes,
} from "n8n-workflow";


const unwrapData = {
	postReceive: [
		{
			type: "rootProperty" as const,
			properties: { property: "data" },
		},
	],
};

export class Stophy implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Stophy",
		name: "stophy",
		icon: "file:stophy.svg",
		group: ["transform"],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: "YouTube context for AI agents via the Stophy API",
		defaults: { name: "Stophy" },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [{ name: "stophyApi", required: true }],
		requestDefaults: {
			baseURL: "https://api.stophy.dev",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		},
		properties: [
			{
				displayName: "Resource",
				name: "resource",
				type: "options",
				noDataExpression: true,
				options: [
					{ name: "Account", value: "account" },
					{ name: "Channel", value: "channel" },
					{ name: "Playlist", value: "playlist" },
					{ name: "Search", value: "search" },
					{ name: "Suggest", value: "suggest" },
					{ name: "Video", value: "video" },
				],
				default: "search",
			},

			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: { show: { resource: ["search"] } },
				options: [
					{
						name: "Search",
						value: "search",
						action: "Search for content",
						routing: {
							request: { method: "POST", url: "/v1/search" },
							output: unwrapData,
						},
					},
				],
				default: "search",
			},
			{
				displayName: "Query",
				name: "query",
				type: "string",
				default: "",
				required: true,
				description: "The search query",
				displayOptions: { show: { resource: ["search"], operation: ["search"] } },
				routing: { send: { type: "body", property: "query", value: "={{ $value }}" } },
			},
			{
				displayName: "Type",
				name: "type",
				type: "options",
				options: [
					{ name: "Channel", value: "channel" },
					{ name: "Playlist", value: "playlist" },
					{ name: "Video", value: "video" },
				],
				default: "video",
				description: "Which kind of result to return",
				displayOptions: { show: { resource: ["search"], operation: ["search"] } },
				routing: { send: { type: "body", property: "type", value: "={{ $value }}" } },
			},
			{
				displayName: "Sort By",
				name: "sortBy",
				type: "options",
				options: [
					{ name: "Rating", value: "rating" },
					{ name: "Relevance", value: "relevance" },
					{ name: "Upload Date", value: "uploadDate" },
					{ name: "View Count", value: "viewCount" },
				],
				default: "relevance",
				displayOptions: { show: { resource: ["search"], operation: ["search"] } },
				routing: { send: { type: "body", property: "sortBy", value: "={{ $value }}" } },
			},

			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: { show: { resource: ["suggest"] } },
				options: [
					{
						name: "Get",
						value: "get",
						action: "Get search suggestions",
						routing: {
							request: { method: "GET", url: "/v1/suggest" },
							output: unwrapData,
						},
					},
				],
				default: "get",
			},
			{
				displayName: "Query",
				name: "q",
				type: "string",
				default: "",
				required: true,
				description: "The partial query to autocomplete",
				displayOptions: { show: { resource: ["suggest"], operation: ["get"] } },
				routing: { send: { type: "query", property: "q", value: "={{ $value }}" } },
			},
			{
				displayName: "Additional Fields",
				name: "additionalFields",
				type: "collection",
				placeholder: "Add Field",
				default: {},
				displayOptions: { show: { resource: ["suggest"], operation: ["get"] } },
				options: [
					{
						displayName: "Language (Hl)",
						name: "hl",
						type: "string",
						default: "",
						description: "Interface language, e.g. en",
						routing: { send: { type: "query", property: "hl", value: "={{ $value }}" } },
					},
					{
						displayName: "Region (Gl)",
						name: "gl",
						type: "string",
						default: "",
						description: "Region code, e.g. US",
						routing: { send: { type: "query", property: "gl", value: "={{ $value }}" } },
					},
				],
			},

			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: { show: { resource: ["video"] } },
				options: [
					{
						name: "Get Comments",
						value: "comments",
						action: "Get video comments",
						routing: {
							request: { method: "POST", url: "/v1/video", body: { type: "comments" } },
							output: unwrapData,
						},
					},
					{
						name: "Get Details",
						value: "details",
						action: "Get video details",
						routing: {
							request: { method: "POST", url: "/v1/video", body: { type: "details" } },
							output: unwrapData,
						},
					},
					{
						name: "Get Live Chat",
						value: "livechat",
						action: "Get live chat messages",
						routing: {
							request: { method: "POST", url: "/v1/video", body: { type: "livechat" } },
							output: unwrapData,
						},
					},
					{
						name: "Get Replies",
						value: "replies",
						action: "Get replies to a comment",
						routing: {
							request: { method: "POST", url: "/v1/video", body: { type: "replies" } },
							output: unwrapData,
						},
					},
					{
						name: "Get Transcript",
						value: "transcript",
						action: "Get video transcript",
						routing: {
							request: { method: "POST", url: "/v1/video", body: { type: "transcript" } },
							output: unwrapData,
						},
					},
				],
				default: "details",
			},
			{
				displayName: "Video URL",
				name: "videoUrl",
				type: "string",
				default: "",
				required: true,
				placeholder: "https://www.youtube.com/watch?v=...",
				description: "The YouTube video URL",
				displayOptions: {
					show: {
						resource: ["video"],
						operation: ["details", "transcript", "comments", "livechat"],
					},
				},
				routing: { send: { type: "body", property: "videoUrl", value: "={{ $value }}" } },
			},
			{
				displayName: "Continuation",
				name: "continuation",
				type: "string",
				default: "",
				required: true,
				description: "The reply continuation token from a comments response",
				displayOptions: { show: { resource: ["video"], operation: ["replies"] } },
				routing: {
					send: { type: "body", property: "continuationToken", value: "={{ $value }}" },
				},
			},
			{
				displayName: "Additional Fields",
				name: "additionalFields",
				type: "collection",
				placeholder: "Add Field",
				default: {},
				displayOptions: { show: { resource: ["video"], operation: ["comments"] } },
				options: [
					{
						displayName: "Continuation",
						name: "continuation",
						type: "string",
						default: "",
						description: "Page token from a previous comments response",
						routing: {
							send: { type: "body", property: "continuationToken", value: "={{ $value }}" },
						},
					},
				],
			},
			{
				displayName: "Additional Fields",
				name: "additionalFields",
				type: "collection",
				placeholder: "Add Field",
				default: {},
				displayOptions: { show: { resource: ["video"], operation: ["livechat"] } },
				options: [
					{
						displayName: "Mode",
						name: "mode",
						type: "options",
						options: [
							{ name: "Top (Moderated)", value: "top" },
							{ name: "Live (All Messages)", value: "live" },
						],
						default: "top",
						routing: { send: { type: "body", property: "mode", value: "={{ $value }}" } },
					},
					{
						displayName: "Continuation",
						name: "continuation",
						type: "string",
						default: "",
						description: "Poll token from a previous livechat response (fetches only new messages)",
						routing: {
							send: { type: "body", property: "continuationToken", value: "={{ $value }}" },
						},
					},
				],
			},

			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: { show: { resource: ["channel"] } },
				options: [
					{
						name: "Get",
						value: "get",
						action: "Get channel data",
						routing: {
							request: { method: "POST", url: "/v1/channel" },
							output: unwrapData,
						},
					},
				],
				default: "get",
			},
			{
				displayName: "Channel URL",
				name: "channelUrl",
				type: "string",
				default: "",
				required: true,
				placeholder: "https://www.youtube.com/@handle",
				description: "The YouTube channel URL",
				displayOptions: { show: { resource: ["channel"], operation: ["get"] } },
				routing: { send: { type: "body", property: "channelUrl", value: "={{ $value }}" } },
			},
			{
				displayName: "Additional Fields",
				name: "additionalFields",
				type: "collection",
				placeholder: "Add Field",
				default: {},
				displayOptions: { show: { resource: ["channel"], operation: ["get"] } },
				options: [
					{
						displayName: "Tab",
						name: "tab",
						type: "options",
						options: [
							{ name: "Video", value: "video" },
							{ name: "Short", value: "short" },
							{ name: "Playlist", value: "playlist" },
							{ name: "About", value: "about" },
						],
						default: "video",
						routing: { send: { type: "body", property: "tab", value: "={{ $value }}" } },
					},
					{
						displayName: "Sort By",
						name: "sortBy",
						type: "options",
						description: "Only applies with the Video tab",
						options: [
							{ name: "Latest", value: "latest" },
							{ name: "Popular", value: "popular" },
							{ name: "Oldest", value: "oldest" },
						],
						default: "latest",
						routing: { send: { type: "body", property: "sortBy", value: "={{ $value }}" } },
					},
				],
			},

			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: { show: { resource: ["playlist"] } },
				options: [
					{
						name: "Get",
						value: "get",
						action: "Get playlist data",
						routing: {
							request: { method: "POST", url: "/v1/playlist" },
							output: unwrapData,
						},
					},
				],
				default: "get",
			},
			{
				displayName: "Playlist URL",
				name: "playlistUrl",
				type: "string",
				default: "",
				required: true,
				placeholder: "https://www.youtube.com/playlist?list=...",
				description: "The YouTube playlist URL",
				displayOptions: { show: { resource: ["playlist"], operation: ["get"] } },
				routing: { send: { type: "body", property: "playlistUrl", value: "={{ $value }}" } },
			},

			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: { show: { resource: ["account"] } },
				options: [
					{
						name: "Get Credits",
						value: "credits",
						action: "Get remaining credits",
						routing: {
							request: { method: "GET", url: "/v1/credits" },
							output: unwrapData,
						},
					},
					{
						name: "Get Logs",
						value: "logs",
						action: "Get request logs",
						routing: {
							request: { method: "GET", url: "/v1/logs" },
							output: unwrapData,
						},
					},
					{
						name: "Get Usage",
						value: "usage",
						action: "Get usage statistics",
						routing: {
							request: { method: "GET", url: "/v1/usage" },
							output: unwrapData,
						},
					},
				],
				default: "credits",
			},
			{
				displayName: "Days",
				name: "days",
				type: "number",
				default: 30,
				description: "Number of days to look back",
				displayOptions: { show: { resource: ["account"], operation: ["usage"] } },
				routing: { send: { type: "query", property: "days", value: "={{ $value }}" } },
			},
			{
				displayName: "Additional Fields",
				name: "additionalFields",
				type: "collection",
				placeholder: "Add Field",
				default: {},
				displayOptions: { show: { resource: ["account"], operation: ["logs"] } },
				options: [
					{
						displayName: "Days",
						name: "days",
						type: "number",
						default: 30,
						description: "Number of days to look back",
						routing: { send: { type: "query", property: "days", value: "={{ $value }}" } },
					},
					{
						displayName: "Endpoint",
						name: "endpoint",
						type: "string",
						default: "",
						placeholder: "/v1/search",
						description: "Filter by endpoint",
						routing: { send: { type: "query", property: "endpoint", value: "={{ $value }}" } },
					},
				],
			},
		],
	};
}
