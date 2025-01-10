import { FindProjectDto, Project } from './types';

export const findProjectDtoToProject = (dto: FindProjectDto): Project => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  is_active: dto.is_active,
});
