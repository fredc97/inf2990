export interface GameCamera {
    init(): void;
    zoomIn(): void;
    zoomOut(): void;
    onResize(width: number, height: number): void;
}
