import { IsEnum, IsNotEmpty, IsInt, Min, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ContentItemType } from '@prisma/client';

// 타입별 데이터 DTO
export class SpeechBubbleDataDto {
  @ApiProperty({ description: '텍스트', example: '안녕하세요!' })
  text: string;
}

export class TextDataDto {
  @ApiProperty({ description: '텍스트', example: '일반 텍스트 내용' })
  text: string;
}

export class ImageDataDto {
  @ApiProperty({ description: '이미지 링크', example: 'https://example.com/image.jpg' })
  imageUrl: string;
}

export class DateDataDto {
  @ApiProperty({ description: '날짜', example: '2024-01-15' })
  date: string;
}

export class LabelTextFieldDataDto {
  @ApiProperty({ description: '레이블', example: '이름' })
  label: string;

  @ApiProperty({ description: '플레이스홀더', example: '이름을 입력하세요' })
  placeholder: string;
}

export class CheckboxDataDto {
  @ApiProperty({ description: '텍스트', example: '동의합니다' })
  text: string;
}

export class QnaDataDto {
  @ApiProperty({ description: '질문 텍스트', example: '당뇨에 대해 알고 계신가요?' })
  question: string;

  @ApiProperty({ description: '플레이스홀더', example: '답변을 입력하세요' })
  placeholder: string;
}

export class CreateStepContentItemDto {
  @ApiProperty({
    description: '컨텐츠 타입',
    enum: ContentItemType,
    example: ContentItemType.TEXT,
  })
  @IsEnum(ContentItemType)
  @IsNotEmpty()
  type: ContentItemType;

  @ApiProperty({
    description: '순서',
    example: 1,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  order: number;

  @ApiProperty({
    description: '타입별 데이터 (JSON)',
    example: { text: '일반 텍스트 내용' },
  })
  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;
}

