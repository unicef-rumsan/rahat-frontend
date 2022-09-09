import React, { useState, useCallback, useEffect } from 'react';
import ModalWrapper from '../../global/CustomModal';
import { FormGroup, Label } from 'reactstrap';
import SelectWrapper from '../../global/SelectWrapper';

import * as AidService from '../../../services/aid';

export default function ProjectSelector({
	showProjectSelector,
	setShowProjectSelector,
	setSelectedProject,
	onProjectSelect
}) {
	const [projectList, setProjectList] = useState([]);

	const listProject = useCallback(async () => {
		const { data } = await AidService.listAid({ start: 0, limit: 1000 });
		if (data && data.length) {
			const select_options = data.map(d => {
				return { label: d.name, value: d._id };
			});
			setProjectList(select_options);
		}
	}, []);

	const toggleProjectModal = () => {
		if (!showProjectSelector) {
			setSelectedProject(null);
		}
		setShowProjectSelector(!showProjectSelector);
	};

	useEffect(() => {
		listProject();
	}, [listProject]);

	return (
		<ModalWrapper
			title="Add to project"
			open={showProjectSelector}
			toggle={toggleProjectModal}
			handleSubmit={onProjectSelect}
		>
			<FormGroup>
				<Label>Project *</Label>
				<SelectWrapper
					onChange={d => setSelectedProject(d.value)}
					maxMenuHeight={150}
					data={projectList}
					placeholder="--Select a Project--"
				/>{' '}
			</FormGroup>
		</ModalWrapper>
	);
}
