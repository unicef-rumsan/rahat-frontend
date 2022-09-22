import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { listFsp, listProjectFsp } from '../../services/fsp';
import { getProjectFromLS } from '../../utils/checkProject';
const projectId = getProjectFromLS();
export default function ({ fsp, onChange, prevFsp, label, disabled, projectFsp = false }) {
	const [fspList, setFspList] = useState([]);
	const [selectedValue, setSelectedValue] = useState({ label: '', value: '' });
	const updateFsp = e => {
		setSelectedValue(prev => ({ ...prev, label: e.label, value: e.value }));
		onChange(e.value);
	};
	useEffect(() => {
		if (!prevFsp) {
			async function fetchData() {
				const res = projectFsp ? await listProjectFsp(projectId) : await listFsp();
				const { data } = res;
				const options = data.map(d => ({ label: d.name, value: d }));
				setFspList(options);
				if (fsp) {
					const selectedVal = options.find(o => o.value === fsp);
					setSelectedValue(prev => ({ ...prev, label: selectedVal.label, value: selectedVal.value }));
				}
				return;
			}
			fetchData();
		}
		return;
	}, [prevFsp, fsp, projectFsp]);
	return (
		<div className="form-item">
			{label === false ? null : (
				<>
					<label htmlFor="name">Entity</label>
					<br />
				</>
			)}
			{!prevFsp ? (
				<Select
					options={fspList}
					value={selectedValue.value ? selectedValue : ''}
					isDisabled={disabled ? true : false}
					onChange={e => updateFsp(e)}
					placeholder={<div>Select Bank...</div>}
				/>
			) : (
				<option value="">-- Add Entity First --</option>
			)}
		</div>
	);
}
