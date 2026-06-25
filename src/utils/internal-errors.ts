export const INTERNAL_ERRORS = {
	PAGE_TITLE: 'API error',
	REQUEST_NVRA_FORM_FAILED: 'Failed to request NVRA form',
	REQUEST_NVRA_FORM_REJECTED: 'NVRA form request was rejected',
	REQUEST_NVRA_FORM_NO_TOKEN:
		'NVRA form request succeeded but no PDF token was returned',
	GET_NVRA_FORM_FAILED: 'Failed to retrieve NVRA form',
	GET_NVRA_FORM_REJECTED: 'NVRA form retrieval was rejected',
	GET_NVRA_FORM_TIMEOUT: 'NVRA form was not ready after multiple attempts',
	VR_LOOKUP_FAILED: 'Failed to check voter registration status',
	NETWORK_ERROR: 'Could not reach the server',
	UNEXPECTED_RESPONSE: 'Unexpected response from the server',
} as const
