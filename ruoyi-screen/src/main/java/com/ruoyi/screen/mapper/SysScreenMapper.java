package com.ruoyi.screen.mapper;

import com.ruoyi.screen.domain.SysScreen;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SysScreenMapper {

    /**
     * 大屏列表
     * 
     * @param sysScreen
     * @return
     */
    public List<SysScreen> selectScreenList(SysScreen sysScreen);

    /**
     * 新增大屏
     * 
     * @param sysScreen
     * @return
     */
    public int insertScreen(SysScreen sysScreen);

    /**
     * 批量删除大屏
     * 
     * @param screenIds
     * @return
     */
    public int deleteScreenByScreenIds(@Param("screenIds") Long[] screenIds, @Param("userId") Long userId);

    /**
     * 查询大屏详情
     * 
     * @param screenId
     * @return
     */
    public SysScreen selectScreenByScreenId(Long screenId);

    /**
     * 修改大屏
     * 
     * @param sysScreen
     * @return
     */
    public int updateScreen(SysScreen sysScreen);

}
