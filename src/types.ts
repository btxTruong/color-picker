export enum MessageType {
	ScreenShot = 'ScreenShot',
	ScreenShotResponse = 'ScreenShotResponse',
}

export interface ScreenShotResponse {
	type: MessageType.ScreenShotResponse;
	tabWidth: number;
	tabHeight: number;
	dataUrl: string;
}
