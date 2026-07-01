import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from "n8n-workflow";

export class StophyApi implements ICredentialType {
	name = "stophyApi";

	displayName = "Stophy API";

	documentationUrl = "https://stophy.dev";

	icon = "file:stophy.svg" as const;

	properties: INodeProperties[] = [
		{
			displayName: "API Key",
			name: "apiKey",
			type: "string",
			typeOptions: { password: true },
			default: "",
			required: true,
			description:
				"Your Stophy API key (starts with st_). Create one at https://stophy.dev.",
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: "generic",
		properties: {
			headers: {
				Authorization: "=Bearer {{$credentials.apiKey}}",
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: "https://api.stophy.dev",
			url: "/v1/credits",
			method: "GET",
		},
	};
}
