import React from 'react';
import * as Icons from 'lucide-react';

export const MedicalIcon = ({ name, className = '', size = 24 }) => {
    const IconComponent = Icons[name];

    if (!IconComponent) {
        // Return a default stethoscope icon if the specific lookup fails
        return <Icons.Stethoscope className={className} size={size} />;
    }

    return <IconComponent className={className} size={size} />;
};

export default MedicalIcon;
