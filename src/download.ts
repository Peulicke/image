import JSZip from "jszip";

const imageToBlob = (image: HTMLImageElement): Promise<Blob> =>
    new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(image, 0, 0);

        canvas.toBlob(blob => {
            if (blob === null) reject();
            else resolve(blob);
        }, "image/png");
    });

const downloadBlob = (blob: Blob, fileName: string): void => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const downloadImage = async (image: HTMLImageElement, fileName: string): Promise<void> => {
    const blob = await imageToBlob(image);
    downloadBlob(blob, fileName);
};

export type NamedImage = {
    name: string;
    image: HTMLImageElement;
};

export const downloadZip = async (images: NamedImage[], zipFileName: string) => {
    const zip = new JSZip();
    await Promise.all(
        images.map(async ({ name, image }) => {
            zip.file(`${name}.png`, await imageToBlob(image), { base64: true });
        })
    );
    const content = await zip.generateAsync({ type: "blob" });
    downloadBlob(content, `${zipFileName}.zip`);
};
