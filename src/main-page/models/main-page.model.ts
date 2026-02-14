import { Column, DataType, Table } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';

export interface GalleryImage {
  id: string;
  src: string;
  size: number;
  order: number;
}

export interface MainPageCreationArgs {
  mainBgImg?: string | null;
  galleryFirstLineImgs?: GalleryImage[] | null;
  gallerySecondLineImgs?: GalleryImage[] | null;
}

@Table({ tableName: 'MainPage' })
export class MainPage extends AbstractModel<MainPage, MainPageCreationArgs> {
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  declare mainBgImg: string | null;

  @Column({ type: DataType.JSON, allowNull: true, defaultValue: null })
  declare galleryFirstLineImgs: GalleryImage[] | null;

  @Column({ type: DataType.JSON, allowNull: true, defaultValue: null })
  declare gallerySecondLineImgs: GalleryImage[] | null;
}
